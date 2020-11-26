import { expect } from "chai";
import { green, grey, red } from "chalk";
import * as fs from "fs";
import * as inquirer from "inquirer";
import * as path from "path";
import * as pluralize from "pluralize";

import { expectWithMessage, TestSuite } from "../test";

const apTitleCase = require("ap-style-title-case"); // tslint:disable-line:no-var-requires

interface InquirerQuestionWithPrefix extends inquirer.Question {
  prefix?: string;
}

interface Value {
  case?: string;
  valid: boolean;
}

interface ValueChoices {
  differences: number;
  original: string;
  titleCased: string;
}

interface ValueList {
  [key: string]: Value;
}

interface ValueLists {
  album: ValueList;
  artist: ValueList;
  genre: ValueList;
  source: ValueList;
  title: ValueList;
}

type ValueType = "album" | "artist" | "genre" | "source" | "title";

export class ValueValidation {

  private static instance: ValueValidation;

  private jsonPath: string;
  private matchAmpersand = /\s*&\s*/g;
  private testSuite: TestSuite;
  private valueLists: ValueLists;

  private constructor() {
    this.jsonPath = path.resolve(__dirname, "..", "..", "values.json");
    this.testSuite = TestSuite.Instance;
    this.valueLists = {
      album: {},
      artist: {},
      genre: {},
      source: {},
      title: {},
    };
  }

  public static get Instance(): ValueValidation {
    if (this.instance) { return this.instance; }
    return this.instance = new this();
  }

  public async populate(): Promise<void> {
    if (await this.valuesExist()) {
      await this.readValues();
    } else {
      await this.writeValues();
    }
  }

  public async validateAlbum(album: string): Promise<void> {
    await this.validate("album", album);
  }

  public async validateArtist(artist: string): Promise<void> {
    if (!artist.includes("&") || this.getStoredValue("artist", artist)) {
      return await this.validate("artist", artist);
    }

    const splitArtists = artist.split(this.matchAmpersand);
    const storedSplitArtists = splitArtists.map((splitArtist) => {
      return this.getStoredValue("artist", splitArtist);
    });

    if (storedSplitArtists.indexOf(undefined) === -1) {
      await this.saveValue("artist", artist, false);
    } else {
      const artists = await this.promptForArtists(artist, splitArtists);

      if (artists.length > 1) {
        await this.saveValue("artist", artist, false);
      }

      for (const actualArtist of artists) {
        try {
          await this.validate("artist", actualArtist);
        } catch (_err) { /* Intentionally swallow error */ }
      }
    }

    await this.validate("artist", artist);
  }

  public async validateGenre(genre: string): Promise<void> {
    await this.validate("genre", genre);
  }

  public async validateSource(source: string): Promise<void> {
    await this.validate("source", source);
  }

  public async validateTitle(title: string): Promise<void> {
    await this.validate("title", title);
  }

  private getStoredValue(type: ValueType, value: string): Value | void {
    const valueCaseInsensitive = value.toLowerCase();

    if (valueCaseInsensitive in this.valueLists[type]) {
      return this.valueLists[type][valueCaseInsensitive];
    }
  }

  private getTitleCase(value: string): string {
    const matchBrackets = /\s*[\[\]\(\)\{\}]\s*/g;
    const valueParts = value.split(matchBrackets);
    const valueBrackets = value.match(matchBrackets) || [];

    return valueParts.reduce((previous, current, index) => {
      const casedPart = apTitleCase(current) || "";
      const bracket = index ? valueBrackets[index - 1] : "";

      return `${previous}${bracket}${casedPart}`;
    }, "");
  }

  private getValueChoices(original: string, titleCased: string): ValueChoices {
    const choicesText: ValueChoices = {
      differences: 0,
      original: "",
      titleCased: "",
    };

    original.split("").forEach((char, index) => {
      if (char === titleCased[index]) {
        choicesText.original += char;
        choicesText.titleCased += char;
      } else {
        choicesText.differences++;
        choicesText.original += red(char);
        choicesText.titleCased += green(titleCased[index]);
      }
    });

    const differenceNumber = choicesText.differences || "No";
    const differenceNoun = pluralize("difference", choicesText.differences);
    choicesText.titleCased += grey(` (${differenceNumber} ${differenceNoun})`);

    return choicesText;
  }

  private async promptForArtists(original: string, split: string[]): Promise<string[]> {
    const choices: inquirer.ChoiceType[] = [split, [original]].map((choice) => {
      const plural = pluralize("artist", choice.length);
      const count = grey(`(${choice.length} ${plural})`);
      const artists = choice.join(", ");

      return {
        name: `${artists} ${count}`,
        value: String(choice.length),
      };
    });

    const choiceQuestion: InquirerQuestionWithPrefix = {
      choices,
      message: `Choose how many artists this is`,
      name: "choice",
      prefix: this.testSuite.getInquirerPrefix(),
      type: "rawlist",
    };

    const answers = await inquirer.prompt(choiceQuestion);
    return answers.choice === "1" ? [original] : split;
  }

  private async promptForValue(type: ValueType, original: string, titleCased: string): Promise<string> {
    const valueChoices = this.getValueChoices(original, titleCased);
    const prefix = this.testSuite.getInquirerPrefix();

    const choiceQuestion: InquirerQuestionWithPrefix = {
      choices: [
        { name: valueChoices.titleCased, value: titleCased },
        { name: valueChoices.original, value: original },
        { name: "Neither", value: "" },
      ],
      message: `Choose the correct ${type} for this song`,
      name: "choice",
      prefix,
      type: "rawlist",
    };

    const inputQuestion: InquirerQuestionWithPrefix = {
      message: `Type the correct ${type} for this song (case sensitive)`,
      name: "input",
      prefix,
      type: "input",
      validate: (answer) => answer ? true : `The song's ${type} cannot be blank`,
      when: (answersSoFar) => !answersSoFar.choice,
    };

    const answers = await inquirer.prompt([choiceQuestion, inputQuestion]);
    return answers.choice || answers.input;
  }

  private isExclusiveType(type: ValueType): boolean {
    const exclusiveTypes: ValueType[] = ["album", "artist", "genre", "source"];
    return exclusiveTypes.indexOf(type) !== -1;
  }

  private readValues(): Promise<void> {
    return new Promise((resolve, reject) => {
      fs.readFile(this.jsonPath, (err: NodeJS.ErrnoException, data: Buffer) => {
        if (err) {
          reject(err);
        } else {
          try {
            this.valueLists = JSON.parse(data.toString()) as ValueLists;
            resolve();
          } catch (err) {
            reject(err);
          }
        }
      });
    });
  }

  private async saveValue(type: ValueType, valueCaseSensitive: string, valid: boolean = true): Promise<void> {
    const value: Value = { valid };
    if (valid) { value.case = valueCaseSensitive; }

    this.valueLists[type][valueCaseSensitive.toLowerCase()] = value;
    await this.writeValues();
  }

  private async validate(type: ValueType, value: string): Promise<void> {
    const exclusive = this.isExclusiveType(type);
    const titleCasedValue = this.getTitleCase(value);
    let storedValue = this.getStoredValue(type, value);

    if (!storedValue && (exclusive || value !== titleCasedValue)) {
      const expectedValue = await this.promptForValue(type, value, titleCasedValue);

      if (value.toLowerCase() !== expectedValue.toLowerCase()) {
        await this.saveValue(type, value, false);
      }

      await this.saveValue(type, expectedValue);
      storedValue = this.getStoredValue(type, value);
    }

    if (storedValue) {
      expectWithMessage(value.toLowerCase(), `Song ${type} tag`, `not be a blacklisted ${type} value`, () => {
        expect((storedValue as Value).valid).to.not.be.false;
      });

      expectWithMessage(value, `Song ${type} tag`, `be title cased like '${storedValue.case}'`, () => {
        expect(value).to.equal((storedValue as Value).case);
      });
    }
  }

  private valuesExist(): Promise<boolean> {
    return new Promise((resolve, reject) => {
      fs.stat(this.jsonPath, (err: NodeJS.ErrnoException) => {
        if (!err) {
          resolve(true);
        } else if (err.code === "ENOENT") {
          resolve(false);
        } else {
          reject(err);
        }
      });
    });
  }

  private writeValues(): Promise<boolean> {
    const data = JSON.stringify(this.valueLists, null, 2);

    return new Promise((resolve, reject) => {
      fs.writeFile(this.jsonPath, data, (err: NodeJS.ErrnoException) => {
        err ? reject(err) : resolve();
      });
    });
  }

}
