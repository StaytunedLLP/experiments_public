import { v4 as uuidv4 } from 'uuid';
import * as _ from 'lodash';
import { marked } from 'marked';


function hello(): string {
    return "Hello from package 2 !" + uuidv4();
}

function processText(text: string){
    const upper = _.upperCase(text);
    return marked.parse(upper);
}

export { hello, processText };