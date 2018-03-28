import { Application } from "stimulus"
import MainController from './MainController'
const application = Application.start()
application.register("main", MainController)