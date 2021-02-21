const prompt = require('prompt-sync')({sigint: true});

const hat = '^';
const hole = 'O';
const fieldCharacter = '░';
const pathCharacter = '*';

//Helper function that generates a random position to put the hat in
const randomPos = (height, width) => {
    const randomRow = height - (Math.floor(Math.random() * 2) + 1);
    const randomCol = Math.floor(Math.random() * width);
    return [randomRow, randomCol];
};

class Field {
    constructor(field) {
        this.field = field;
    }
    
    //Prints the field
    print() {
        console.clear();
        this.field.forEach(array => {
            console.log(array.join(''));
        })
    }

    //Generates a random field given the number of rows and columns. It uses the Field class built-in method to generate a valid field
    static generateField(height, width) {
        let randomField = [];
        let newField;
        do {
            randomField = [];
            newField = [];
            let subfield = ['*'];
            for (let i = 0; i < height; i++) {
                while (subfield.length < width) {
                    const randomNumber = Math.random();
                    if (randomNumber > 0.70) {
                        subfield.push(hole);
                    } else {
                        subfield.push(fieldCharacter);
                    };
                };
                randomField.push(subfield);
                subfield = [];
            };
            //Put hat in a random position on one of the last 2 rows
            const hatPosition = randomPos(height, width);
            randomField[hatPosition[0]].splice([hatPosition[1]], 1, hat);
            //Make copy of randomField to return in case it\'s valid, since the checking function alters the array.
            newField = randomField.map(arr => {
                return arr.slice();
            });
        } while (!Field.checkField(randomField));
        return newField;
    }

    //Starts the game and handles its logic
    playGame() {
        let x = 0;
        let y = 0;
        let playing = true;
        this.print();

        while(playing) {
            let move = prompt('Where do you want to move?');
            try{
                switch (move) {
                    case 'l':
                        x--;
                        break;
                    case 'r':
                        x++;
                        break;
                    case 'u':
                        y--;
                        break;
                    case 'd':
                        y++;
                        break;
                };

                if (this.field[y][x] === hole) {
                    console.log('You fell down a hole!');
                    playing = false;
                } else if (this.field[y][x] === hat) {
                    console.log('Yay! You found your hat!');
                    playing = false;
                } else if(x < 0 || x >= this.field[0].length || y >= this.field.length) {
                    console.log('Oh no! You went outside the field! Try again.');
                    playing = false;
                } else {
                    this.field[y][x] = pathCharacter
                    this.print();
                }
            } catch {
                console.log('Oh no! You went outside the field! Try again.');
                playing = false;
            };
        }
    }

    //Check if the field is solvable
    static checkField(field) {
        let x = 0;
        let y = 0;
        let lastMove = [];
        let topMargin = true;
        let bottomMargin = false;
        let rightMargin = false;
        let leftMargin = true;
        const startTime = Date.now();

        while(field[y][x] !== hat) {
            //Set timeout --- if hat isn't found by then, the maze is assumed to be unsolvable
            if (Date.now() - startTime > 1000) {break};

            field[y][x] = pathCharacter;
            
            //Go right?
            if (rightMargin === false && (field[y][x + 1] === fieldCharacter || field[y][x + 1] === hat)){
                x++;
                //Check if at the right margin
                if (x === field[y].length - 1) {
                    rightMargin = true;
                }
                leftMargin = false;
                lastMove.push('r');
            //Go down?
            } else if (bottomMargin === false && (field[y + 1][x] === fieldCharacter || field[y + 1][x] === hat)) {
                y++;
                //Check if at the bottom margin
                if (y === field.length - 1) {
                    bottomMargin = true;
                };
                topMargin = false;
                lastMove.push('d');
            //Go left?
            } else if (leftMargin === false && (field[y][x - 1] === fieldCharacter || field[y][x - 1] === hat)) {
                x--;
                //Check if at the left margin
                if (x === 0) {
                    leftMargin = true;
                }
                rightMargin = false;
                lastMove.push('l');
            //Go up?
            } else if (topMargin === false && (field[y - 1][x] === fieldCharacter || field[y - 1][x] === hat)) {
                y--;
                //Check if at the top margin
                if (y === 0) {
                    topMargin = true;
                };
                bottomMargin = false;
                lastMove.push('u');
            //Go back!
            } else {
                switch (lastMove[lastMove.length - 1]) {
                    case 'r':
                        x--;
                        //Check if at the left margin
                        if (x === 0) {
                            leftMargin = true;
                        }
                        rightMargin = false;
                        lastMove.pop();
                        break;
                    case 'd':
                        y--;
                        //Check if at the top margin
                        if (y === 0) {
                            topMargin = true;
                        };
                        bottomMargin = false;
                        lastMove.pop();
                        break;
                    case 'l':
                        x++;
                        //Check if at the right margin
                        if (x === field[y].length - 1) {
                            rightMargin = true;
                        }
                        leftMargin = false;
                        lastMove.pop();
                        break;
                    case 'u':
                        y++;
                        //Check if at the bottom margin
                        if (y === field.length - 1) {
                            bottomMargin = true;
                        };
                        topMargin = false;
                        lastMove.pop();
                        break;
                };
            };

        }
        if (field[y][x] === hat) {
            return true;
            console.log('The maze can be solved!');
        } else {
            return false;
            console.log('I could\'t solve the maze, sorry!');
        };
    }
};



//Example of playing the game with an auto generated field
const autoField = new Field(Field.generateField(15, 30));
autoField.playGame();