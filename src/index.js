import { AppController } from "./controller/app-controller";
import "./styles.css";

var appcontroller = new AppController();
appcontroller.setupGame().then(function(){
    appcontroller.startGame();
})
