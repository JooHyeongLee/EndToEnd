const readline = require('readline');
const fs = require('fs');
const rl = readline.createInterface({
	input: process.stdin,
	output: process.stdout
});
//dict파일을 단어 배열형태로 저장
let dict = fs.readFileSync('./dict.txt').toString().replace(/\r/g,"").split('\n')

class Game {
	constructor(){
		this.word = null;
		this.wordList = [];
	}
	start(){					
		console.log('끝말잇기 시작.')
		rl.question("첫 단어를 입력하세요 :",word=>{
			this.word = word;
			this.wordList.push(word);
			this.computer();
		});
	}
	user(){
		rl.question("your turn : ",word=>{
			if(word==='리스트 보기'){
				console.log(this.wordList);
				this.user();
			}
			else if(this.validation(word)){
				this.word = word;
				this.wordList.push(word);
				this.computer();
			}
			else{
				console.log('이미 나왔거나 규칙에 맞지 않는 단어입니다.')
				this.user();
			}
		});
	}
	computer(){							
		process.stdout.write("computer answer : ");	
		this.word = this.wordSearch();	//wordSearch 함수에서 나온 결과 값을 현재 단어로 저장
		this.wordList.push(this.word);	//진행 단어리스트에 단어 저장
		this.user();					//user에게 턴 넘김
	}
	wordSearch(){
		//dict파일에서 사용자가 입력한 끝말로 시작하는 단어 중 2글자 이상인 것들만 필터링
		let answer=dict.filter(v=>{
			return v.charAt(0)===this.word.slice(-1) && v.length>=2 && v!==this.word;
		});
		//검색된 단어가 없을 때 프로그램 종료
		if(answer.length ===0){				
			console.log('제가 졌습니다.');	
			process.exit();				
		}
		else{								
			//필터링된 단어들 중 하나를 선택
			let idx = Math.floor(Math.random()*answer.length);	
			console.log(answer[idx],'\n');
			//컴퓨터가 말한 단어를 단어사전에서 제거
			dict = dict.filter(v=>v!==answer[idx]);
			return answer[idx];
		}
	}
	validation(word){
		//사용자가 입력한 단어가 기본 규칙에 맞는지 검사
		if(!this.wordList.includes(word) && word.charAt(0)===this.word.slice(-1) &&  word.length>=2)
			return true;
		 else
			return false;
	}
}

let game = new Game();
game.start();
