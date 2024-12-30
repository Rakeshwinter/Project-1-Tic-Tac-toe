

const boxFill = {
    "aa": '', 'ab': '', 'ac': '',
    'ba': '', 'bb': '', 'bc': '',
    'ca': '', 'cb': '', 'cc': ''
};

function areListsEqual(list1, list2) {
    // Check if lengths are the same
    if (list1.length !== list2.length) {
        return false;
    }

    // Compare elements one by one
    for (let i = 0; i < list1.length; i++) {
        if (list1[i] !== list2[i]) {
            return false;
        }
    }

    return true; // Lists are equal
}

function checkWin(object) {
    let str = 'abc';
    // Check rows, columns, and diagonals

    // Check rows
    for (let i = 0; i < str.length; i++) {
        let rowList = [];
        let itemList = [];
        for (let j = 0; j < str.length; j++) {
            let item = `${str[i]}${str[j]}`;
            rowList.push(object[item]);
            itemList.push(item);
        }
        if (areListsEqual(rowList, ['x', 'x', 'x'])) {
            return ["x", itemList];
        } else if (areListsEqual(rowList, ['o', 'o', 'o'])) {
            return ["o", itemList];
        }
    }

    // Check columns
    for (let i = 0; i < str.length; i++) {
        let colList = [];
        let itemList = [];
        for (let j = 0; j < str.length; j++) {
            let item = `${str[j]}${str[i]}`;
            colList.push(object[item]);
            itemList.push(item);
        }
        if (areListsEqual(colList, ['x', 'x', 'x'])) {
            return ["x", itemList];
        } else if (areListsEqual(colList, ['o', 'o', 'o'])) {
            return ["o", itemList];
        }
    }

    // Check diagonals
    let diag1List = [object["aa"], object["bb"], object["cc"]];
    let diag2List = [object["ac"], object["bb"], object["ca"]];
    if (areListsEqual(diag1List, ['x', 'x', 'x'])) {
        return ["x", ['aa', 'bb', 'cc']];
    } else if (areListsEqual(diag1List, ['o', 'o', 'o'])) {
        return ["o", ['aa', 'bb', 'cc']];
    }
    if (areListsEqual(diag2List, ['x', 'x', 'x'])) {
        return ["x", ['ac', 'bb', 'ca']];
    } else if (areListsEqual(diag2List, ['o', 'o', 'o'])) {
        return ["o", ['ac', 'bb', 'ca']];
    }

    return ['draw', [] ]; // No winner
}
function lineAnimaitonCal(list){
    let str = "";
    list.forEach(element => {
        str += element;
    });
    let startStr = str.substring(0,2);
    let remainStr = str.substring(2);

    if(str == 'aabbcc' || str == "acbbca"){
        return [".diag-transition", remainStr];
    }else{
        return [`.${startStr}`,remainStr];
    }


}
function winAnimation(char, action) {
   
    if (action === "add" || action === "remove") {
        const method = action === "add" ? "addClass" : "removeClass";

        $('.footer')[method]('add-width');
        $('.footer-para')[method]('add-opacity');

        if (char === 'draw') {
            $('.draw')[method]("full-view");
            $('.draw').find(".o-item")[method]('animation');
            $('.draw').find(".x-item")[method]('animation');
            $('.draw-text')[method]('come-in');
        } else {
            $(`.${char}-winner`)[method]("full-view");
            $(`.${char}-object`)[method]('animation');
            $(`.${char}-winner`).find('.winner')[method]('come-in');
        }
    }    
}

function scoreboardAnimation(item){
    if (item === ".x-item") {
        $(".sb-oshadow").addClass("border");
        $(".sb-xshadow").removeClass("border");
        
        
    } else {
        $(".sb-xshadow").addClass("border");
        $(".sb-oshadow").removeClass("border");
    }
}



let item = ".x-item";
let scoreboard = ".x-scoreboard";
let scoreX = 0;
let scoreO = 0;
var countDraw = 0;
var isDraw = true;

//only for the start
$(".sb-xshadow").addClass("border");

$(".game-box").on("click", ".single-box",function () {

    $(this).attr("class","no-click");

    $(this).find(item).addClass("animation");

    let element = $(this).attr("id");

    boxFill[element] = item[1];

    scoreboardAnimation(item);

    if (item === ".x-item") {
        item = ".o-item";
    } else {
        item = ".x-item";
    }
    countDraw++;
    if (checkWin(boxFill)[0] != 'draw') {

        let resultArray = checkWin(boxFill);
        var lineArray = lineAnimaitonCal(resultArray[1]);
        $(lineArray[0]).addClass(lineArray[1]);

        setTimeout(function () {
            winAnimation(resultArray[0], 'add');
        }, 1000);

        if(checkWin(boxFill)[0] == "x"){
            scoreX++;
        }else{
            scoreO++;
        }

        $('.x-score').text(scoreX);
        $('.o-score').text(scoreO);
        //no more click 

        $('.single-box').attr("class","no-click");

        nextGame(lineArray, resultArray);

    }else if(countDraw == 9){
        setTimeout(function () {
            isDraw = true;
            winAnimation('draw', 'add');
        }, 1000);
        let resultArray = checkWin(boxFill);
        var lineArray = lineAnimaitonCal(resultArray[1]);
        //error herezs

        nextGame(lineArray, resultArray);
    }
});


function nextGame(lineArray, resultArray) {
    setTimeout(function () {
        // Clear any previous event listeners on the document to avoid stacking
        $(document).off("click", resetGame);

        // Define the reset logic as a separate function
        function resetGame() {
            countDraw = 0;
    
            winAnimation(resultArray[0], 'remove');

            // Reset the game board
            $('.no-click').attr("class", "single-box");

            for (const key in boxFill) {
                boxFill[key] = "";
            }
        
            // Remove any animations from X and O items
            $('.x-item').removeClass("animation");
            $('.o-item').removeClass("animation");
        
            // Remove the winning line animation
            if (resultArray[0] != 'draw') {
                $(lineArray[0]).removeClass(lineArray[1]);
            }
        
            // Remove this event listener after reset
            $(document).off("click", resetGame);
            isDraw = false;
        }
        

        // Add the click listener for resetting the game
        $(document).on("click", resetGame);
    }, 2000);
}

$(".x-scoreboard").addClass("flex-box");
$(".o-scoreboard").addClass("flex-box");
$(".x-scoreboard p").addClass("flex-box");
$(".o-scoreboard p").addClass("flex-box");


