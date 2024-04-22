const usernameInput = document.querySelector("#username-input");

// function use to change URL to other pages.
function goToWithCheckInput(URL) {
    console.log(usernameInput.value);
    if (!usernameInput.value) {
        alert("please fill your username first");
    } else {
        window.location.href = URL;
    }
}


//room settings
function roomSetting(player1name,player2name){
    document.getElementById("player1name").innerHTML=player1name
    document.getElementById("player2name").innerHTML=player2name

}


//function to change each side icon

    const player1interface=document.getElementById("player1pane")
const player2interface=document.getElementById("player2pane")

function changeplayer1Icon(choice){
    for (let index = 0; index < 3; index++) {
        player1interface.getElementById("rock1").src="./asset//blankspace.png"
        player1interface.getElementById("paper1").src="./asset//blankspace.png"
        player1interface.getElementById("scrissor1").src="./asset//blankspace.png"
    
        if (choice=="rock") {
            player1interface.getElementById("rock1").src="./asset//rock.png"
        } else
        if (choice=="paper") {
            player1interface.getElementById("paper1").src="./asset//paper.png"
        } else1
        if (choice=="scrissors"){    
            player1interface.getElementById("scrissor1").src="./asset//scrissor.png"
        } 
        
    }
}

function changeplayer2Icon(choice){
    for (let index = 0; index < 3; index++) {
        player2interface.getElementById("rock2").src="./asset//rock.png"
        player2interface.getElementById("paper2").src="./asset//paper.png"
        player2interface.getElementById("scrissor2").src="./asset//scrissor.png"
    
        if (choice=="rock") {
            player2interface.getElementById("rock2").src="./asset//rock.png"
        } else
        if (choice=="paper") {
            player2interface.getElementById("paper2").src="./asset//paper.png"
        } else1
        if (choice=="scrissors"){    
            player2interface.getElementById("scrissor2").src="./asset//scrissor.png"
        } 
        
    }
}

function resetPlayerIcon(){
    player1interface.getElementById("rock1").src="./asset//rock.png"
    player1interface.getElementById("paper1").src="./asset//paper.png"
    player1interface.getElementById("scrissor1").src="./asset//scrissor.png"
    player2interface.getElementById("rock2").src="./asset//rock.png"
    player2interface.getElementById("paper2").src="./asset//paper.png"
    player2interface.getElementById("scrissor2").src="./asset//scrissor.png"
}


//method about function of icon

function addIconFunction(){
    player1interface.getElementById("rock1").addEventListener("click",sendToserver  )
    player1interface.getElementById("paper1").addEventListener("click", sendToserver)
    player1interface.getElementById("scrissor1").addEventListener("cllick", sendToserver)
    
}
function sendToserver(choice){

    player1interface.getElementById("rock1").removeEventListener("click",sendToserver )
    player1interface.getElementById("paper1").removeEventListener("click", sendToserver)
    player1interface.getElementById("scrissor1").removeEventListener("cllick", sendToserver)
}

function onClick(text){
    fetch(url, {
            headers: {
                "Content-Type": "application/json",
                },
            method: 'post',
            body: JSON.stringify({
                choice: text,
            })
        })
 }