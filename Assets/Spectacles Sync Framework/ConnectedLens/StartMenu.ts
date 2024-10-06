import {PinchButton} from "../SpectaclesInteractionKit/Components/UI/PinchButton/PinchButton"
import NativeLogger from "../SpectaclesInteractionKit/Utils/NativeLogger"
// import 'Spectacles Sync Framework/ConnectedLens/SetUsername';

@component
export class StartMenu extends BaseScriptComponent {
  @input
  singlePlayerButton: PinchButton

  @input
  multiPlayerButton: PinchButton

  @input("string", "manual")
  @widget(
    new ComboBoxWidget([
      new ComboBoxItem("Manual", "manual"),
      new ComboBoxItem("Mocked Online (Automatic)", "mocked_online"),
    ])
  )
  singlePlayerType: "manual" | "mocked_online" = "manual"

  @input
  enableOnSingleplayerNodes: SceneObject[]

  private nativeLogger = new NativeLogger("StartMenu")

  constructor() {
    super()
  }

  onAwake() {
    this.createEvent("OnStartEvent").bind(this.onStart.bind(this))

    global.sessionController.onSessionCreated.add((session: MultiplayerSession, type: ConnectedLensSessionOptions.SessionCreationType) => {
      this.nativeLogger.i("[nim-log] Created session")
      if(session.activeUsersInfo) {
        this.nativeLogger.i(`[nim-log] Active users length: ${session.activeUserCount} | ${session.activeUsersInfo.length}`) // 0 | 1
        this.nativeLogger.i(`[nim-log] Name: ${session.activeUsersInfo[0].displayName}`)
        this.nativeLogger.i(`[nim-log] User ID: ${session.activeUsersInfo[0].userId}`)
        if(session.activeUserCount > 0) {
          this.nativeLogger.i(`[nim-log] ${JSON.stringify(session.activeUsersInfo[0])}`)
        }
        // changeUsernameText("NIMIT SHAH TEST")
        // script.createSceneObject("")
      }

      // Create text object
    });
    global.sessionController.onUserJoinedSession.add((session: MultiplayerSession, user: ConnectedLensModule.UserInfo) => {
      this.nativeLogger.i("[nim-log] Creating text object")
      // var textObject = script.createScene("User Text");
      
      // var textComponent = textObject.createComponent("Component.Text");
      this.nativeLogger.i("[nim-log] text: " + user.displayName);
    });

    // Re-enable the start menu if the connection fails
    global.sessionController.onConnectionFailed.add(() => {
      this.getSceneObject().enabled = true
    })

    // Skip the start menu if the lens was launched directly as multiplayer
    this.checkIfStartedAsMultiplayer()
  }

  onStart() {
    this.singlePlayerButton.onButtonPinched.add(
      this.onSinglePlayerPress.bind(this)
    )
    this.multiPlayerButton.onButtonPinched.add(
      this.startMultiplayerSession.bind(this)
    )
  }

  /**
   * If the systemUI has requested that the lens launch directly into multiplayer mode,
   * immediately dismiss this menu and initialize the sync framework.
   */
  checkIfStartedAsMultiplayer() {
    const shouldStartMultiplayer =
      global.launchParams.getBool("StartMultiplayer")
    this.nativeLogger.i(
      `Lens started as multiplayer: ${shouldStartMultiplayer}`
    )
    if (shouldStartMultiplayer) {
      this.startMultiplayerSession()
    }
  }

  /**
   * Start the game in single player mode by hiding this menu.
   */
  private onSinglePlayerPress() {
    switch (this.singlePlayerType) {
      case "manual":
      default:
        this.enableOnSingleplayerNodes.forEach((node) => {
          node.enabled = true
        })

        this.getSceneObject().enabled = false
        break

      case "mocked_online":
        global.sessionController.prepareOfflineMode()

        this.enableOnSingleplayerNodes.forEach((node) => {
          node.enabled = true
        })

        this.startMultiplayerSession()
        break
    }
  }

  /**
   * Start the session by initializing the sync framework, and hiding this menu.
   */
  private startMultiplayerSession() {
    this.nativeLogger.i("Starting session")
    this.getSceneObject().enabled = false
    global.sessionController.init()
  }
}
