import { v4 as uuidv4 } from 'uuid';
import { marked } from 'marked';
import chalk from 'chalk';
function hello() {
    return chalk.green(`Hello from package2 with `) + chalk.red(uuidv4());
}
function processText(text) {
    const upper = text.toUpperCase();
    const markedText = marked.parse(upper);
    return markedText;
}
export { hello, processText };
