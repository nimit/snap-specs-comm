// @input Asset.ConnectedLensModule connectedLensModule

import {SyncFrameworkLogger} from "../Utils/SyncFrameworkLogger"


@component
export class NewUserInit extends BaseScriptComponent {

  private readonly log: SyncFrameworkLogger = new SyncFrameworkLogger(NewUserInit.name)

  onAwake() {
    let sessionController: SessionController = global.sessionController
    sessionController.notifyOnReady(this.onReady.bind(this))
    sessionController.onUserJoinedSession.add((session: MultiplayerSession, user: ConnectedLensModule.UserInfo) => {
        this.log.i("[nim-log] Creating text object")
        // var textObject = script.createScene("User Text");
        // var textComponent = textObject.createComponent("Component.Text");
        this.log.i("[nim-log] text: " + user.displayName);
    });
  }

  onReady() {
    this.log.i("Example Component: The session controller is ready!")
    print("Example Component: The session controller is ready!")
    let sessionController: SessionController = global.sessionController;
   
  }
}
