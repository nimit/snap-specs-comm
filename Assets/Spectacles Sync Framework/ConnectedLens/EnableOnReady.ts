import NativeLogger from "../SpectaclesInteractionKit/Utils/NativeLogger"

@component
export class EnableOnReady extends BaseScriptComponent {
  @input
  nodesToEnable: SceneObject[]

  private nativeLogger = new NativeLogger("EnableOnReady")

  onAwake() {
    this.setNodesEnabled(false)
    global.sessionController.notifyOnReady(this.onReady.bind(this))
  }

  onReady() {
    this.setNodesEnabled(true)
    // this.nativeLogger.i("[nim-log] NODES = TRUE")
    // global.sessionController.onUserJoinedSession.add((session: MultiplayerSession, user: ConnectedLensModule.UserInfo) => {
    //   this.nativeLogger.i("[nim-log] Creating text object")
    //   // var textObject = script.createScene("User Text");
    //   // var textComponent = textObject.createComponent("Component.Text");
    //   this.nativeLogger.i("[nim-log] text: " + user.displayName);
    //   // textComponent.text = user.displayName;
    //   // textComponent.color = new vec4(1, 1, 1, 1);
    //   // textComponent.fontSize = 75;
    //   // textObject.getTransform().setWorldPosition(new vec3(0, 0, -1));
    //   // textObject.parent = script.getSceneObject();
    // });
  }

  setNodesEnabled(enabled: boolean) {
    for (const node of this.nodesToEnable) {
      node.enabled = enabled
    }
  }
}
