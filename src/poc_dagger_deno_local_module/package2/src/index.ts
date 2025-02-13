import { v4 as uuidv4 } from 'uuid';
import { marked } from 'marked';
import chalk from 'chalk';

function hello(): string {
    return chalk.green(`Hello from package2 with `) + chalk.red(uuidv4());
}

function processText(text: string) {
    const upper = text.toUpperCase();
    const markedText = marked.parse(upper);
    return markedText;
}

export { hello, processText };