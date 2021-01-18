// consts
const calculator = document.querySelector('.calc');
const display = calculator.querySelector('.display');
const keys = calculator.querySelector('.keys');
const ops = keys.querySelector('.ops');
const nums = keys.querySelector('.nums');
const other = keys.querySelector('.other');
const equals = other.querySelector('.eq');
const clear = other.querySelector('.clear');
const allClear = other.querySelector('.all-clear');

// classes
class Calculator {
    operatorArr = ['+', '-', '/', '*', '^', '%'];
    operatorMap = this.fillOperatorMap();
    numberArr = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];
    phrase = '';
    constructor() {
        this.addEventListenerToOps();
        this.addEventListenerToNums();
        this.addEventListenerToAllClear();
        this.addEventListenerToClear();
        this.addEventListenerToEquals();
        this.addKeyboardListenerToPage();
    }
    addKeyboardListenerToPage() {
        document.addEventListener('keyup', (event) => {
            let keyPressed = event.key;
            if (this.operatorArr.includes(keyPressed)) {
                let oprName = this.operatorMap[keyPressed];
                document.getElementsByClassName(oprName)[0].click();
            } else if(this.numberArr.includes(keyPressed)) {
                document.getElementsByClassName(keyPressed)[0].click();
            } else if(keyPressed == 'Backspace') {
                document.getElementsByClassName('clear')[0].click();
            } else if(keyPressed == 'Enter' || keyPressed == '=') {
                document.getElementsByClassName('eq')[0].click();
                return;
            } else if(keyPressed == 'c' || keyPressed == 'C') {
                document.getElementsByClassName('all-clear')[0].click();
            }
            if(this.phrase == '') display.textContent = '0';
            else display.textContent = this.phrase;
        });
    }
    addEventListenerToOps() {
        ops.addEventListener('click', (event) => {
            const isButton = event.target.nodeName === 'BUTTON';
            if (!isButton) return;
            let lastChar = this.phrase.slice(-1);
            let newChar = event.target.textContent;
            if (this.phrase.length > 0) {
                if (this.checkOp(lastChar)) {
                    this.phrase = this.replaceCharAt(this.phrase, newChar, this.phrase.length - 1);
                } else this.phrase += newChar;
                display.textContent = this.phrase;
                console.log(this.phrase);
            }
        });
    }
    addEventListenerToNums() {
        nums.addEventListener('click', (event) => {
            const isButton = event.target.nodeName === 'BUTTON';
            if (!isButton) return;
            const newChar = event.target.textContent;
            this.phrase += newChar;
            display.textContent = this.phrase;
            console.log(this.phrase);
        })
    }
    addEventListenerToAllClear() {
        allClear.addEventListener('click', (event) => {
            const isButton = event.target.nodeName === 'BUTTON';
            if (!isButton) return;
            this.phrase = '';
            display.textContent = '0';
        })
    }
    addEventListenerToClear() {
        clear.addEventListener('click', (event) => {
            const isButton = event.target.nodeName === 'BUTTON';
            if (!isButton) return;
            if (this.phrase.length > 0) {
                this.phrase = this.replaceCharAt(this.phrase, '', this.phrase.length - 1);
                console.log(this.phrase);
                if(this.phrase == '') display.textContent = '0';
                else display.textContent = this.phrase;
                console.log(this.phrase);
            }
        })
    }
    addEventListenerToEquals() {
        equals.addEventListener('click', () => {
            this.calculate();
        });
    }
    calculate() {
        let phraseCopy = this.phrase.slice();
        let flag = false;
        for (let elem of this.operatorArr) {
            if (phraseCopy.includes(elem)) {
                flag = true;
                break;
            }
        }
        if (!flag) return;
        let termArr = [];
        let oprArr = [];
        while (true) {
            let oprIndex = this.indexOfOp(phraseCopy);
            if (oprIndex == -1) {
                termArr.push(phraseCopy);
                phraseCopy = '';
                break;
            } else {
                termArr.push(phraseCopy.slice(0, oprIndex));
                oprArr.push(phraseCopy.slice(oprIndex, oprIndex + 1));
                phraseCopy = phraseCopy.slice(oprIndex + 1);
            }
        }
        let result = 0;
        let oprArrIndex = 0;
        for (let i = 0; i < termArr.length; i++) {
            if (i == 0) {
                result += +termArr[i];
            } else {
                result = this.calculateOperations(result, oprArr[oprArrIndex], +termArr[i]);
                oprArrIndex++;
            }
        }
        display.textContent = result;
        this.phrase = '';
    }
    calculateOperations(term1, opr, term2) {
        let result;
        switch (opr) {
            case '+':
                result = term1 + term2;
                break;
            case '-':
                result = term1 - term2;
                break;
            case '/':
                result = term1 / term2;
                break;
            case '*':
                result = term1 * term2;
                break;
            case '^':
                result = Math.pow(term1, term2);
                break;
            case '%':
                result = term1 % term2;
                break;
        }
        return result;
    }
    replaceCharAt(str, char, pos) {
        return str.slice(0, pos) + char + str.slice(pos + 1);
    }
    checkOp(char) {
        for (let elem of this.operatorArr) {
            if (char == elem) return true;
        }
        return false;
    }
    indexOfOp(str) {
        let index = -1;
        for (let elem of this.operatorArr) {
            let elemIndex = str.indexOf(elem);
            if ((index == -1 && elemIndex > -1) || (elemIndex > -1 && elemIndex < index)) {
                index = elemIndex;
            }
        }
        return index;
    }
    fillOperatorMap() {
        let map = new Map;
        map['+'] = 'add';
        map['-'] = 'sub';
        map['/'] = 'div';
        map['*'] = 'mul';
        map['^'] = 'pow';
        map['%'] = 'mod';
        return map;
    }
}

const calc = new Calculator;