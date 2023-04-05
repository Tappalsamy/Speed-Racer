class Player {
  constructor() {
    this.name = null
    this.index = null
    this.positionX = 0
    this.positionY = 0
    this.score = 0
    this.rank = 0
    this.fuel = 200
    this.life = 200
  }
  addPlayer(){
    if(this.index == 1){
      this.positionX=width/2-100
    }
    else{
      this.positionX=width/2+100
    }
    database.ref("players/player"+this.index).set({
      name:this.name,
      positionX:this.positionX,
      positionY:this.positionY,
      rank:this.rank,
      score:this.score,
      life:this.life,
    })
  }
  getCount(){
    database.ref("playerCount").on("value",x=>{
      playerCount=x.val()
    })
  }
  updateCount(x){
    database.ref("/").update({
      playerCount:x

    })
  }
  static getPlayersInfo(){
    database.ref("players").on("value",x=>{
      allPlayers=x.val()
    })
  }
  getDistance(){
    database.ref("players/player"+this.index).on("value",x=>{
      var data=x.val()
      this.positionX=data.positionX
      this.positionY=data.positionY
    })
  }
  update(){
    database.ref("players/player"+this.index).update({
      name:this.name,
      positionX:this.positionX,
      positionY:this.positionY,
      rank:this.rank,
      score:this.score,
      life:this.life,
    })
  }
  getCarsAtEnd(){
    database.ref("carsAtEnd").on("value",x=>{
      this.rank=x.val()
    })
  }
  static updateCarsAtEnd(x){
    database.ref("/").update({
      carsAtEnd:x

    })
  }
}
