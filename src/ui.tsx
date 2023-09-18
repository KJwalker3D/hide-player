import {
  engine,
  Transform,
} from '@dcl/sdk/ecs'
import { Color4 } from '@dcl/sdk/math'
import ReactEcs, { Button, Label, ReactEcsRenderer, UiEntity } from '@dcl/sdk/react-ecs'
import { Cube } from './components'
import { createCube } from './factory'
//import { playerList } from './block'
import { getPlayersInScene } from '~system/Players'
import { onEnterSceneObservable, onLeaveSceneObservable} from '@dcl/sdk/observables'
import * as ui from 'dcl-ui-toolkit'

// THIS IS A DEMO WITH THE UI TOOLKIT

export const customPrompt = ui.createComponent(ui.CustomPrompt, {
  style: ui.PromptStyles.DARKSLANTED,
  height: 600,
})

const promptTitle = customPrompt.addText({
  value: 'Who do you want to hide?',
  xPosition: 0,
  yPosition: 250,
  color: Color4.Yellow(),
  size: 30,
})

/*
const promptText = customPrompt.addText({
  value: "It's an important decision",
  xPosition: 0,
  yPosition: 200,
})

const promptCheckbox = customPrompt.addCheckbox({
  text: "Don't show again",
  xPosition: -80,
  yPosition: 150,
  onCheck: () => {
    console.log('checkbox checked')
  },
  onUncheck: () => {
    console.log('checkbox unchecked')
  },
})

const promptSwitch = customPrompt.addSwitch({
  text: 'Turn me',
  xPosition: -60,
  yPosition: 50,
  onCheck: () => {
    console.log('switch checked')
  },
  onUncheck: () => {
    console.log('switch unchecked')
  },
})
*/

const promptTextBox = customPrompt.addTextBox({
  placeholder: 'Enter text',
  xPosition: 0,
  yPosition: 100,
  onChange: (value) => {
    console.log('textbox changed:', value)
  },
}) 

// Use 'value' / cross reference it with player data in the scene 
// Either display name or wallet address 


const promptButtonE = customPrompt.addButton({
  style: ui.ButtonStyles.E,
  text: 'Yeah',
  xPosition: 0,
  yPosition: -150,
  onMouseDown: () => {
    console.log('Yeah clicked')
  },
})

const promptButtonF = customPrompt.addButton({
  style: ui.ButtonStyles.F,
  text: 'Nope',
  xPosition: 0,
  yPosition: -225,
  onMouseDown: () => {
    console.log('Nope clicked')
  },
})


customPrompt.show()
console.log('custom prompt should be visible')
/*
const promptIcon = customPrompt.addIcon({
  image: 'images/scene-thumbnail.png',
  xPosition: 0,
  yPosition: -50,
})
*/





/*
///// THIS IS ONE APPROACH WITHOUT UI TOOLKIT


// Define a state variable to hold the player list
interface Player {
  displayName: string;
}

//let PlayerList = playerList
let playerList: Player[] = []; // Initialize an empty array

export function setupUi() {
  ReactEcsRenderer.setUiRenderer(uiComponent)
}

const uiComponent = () => (
  <UiEntity
    uiTransform={{
      width: 400,
      height: 230,
      margin: '16px 0 8px 270px',
      padding: 4,
    }}
    uiBackground={{ color: Color4.create(0.5, 0.8, 0.1, 0.6) }}
  >
    <UiEntity
      uiTransform={{
        width: '100%',
        height: '100%',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'space-between'
      }}
      uiBackground={{ color: Color4.fromHexString("#70ac76ff") }}
    >
      <UiEntity
        uiTransform={{
          width: '100%',
          height: 80,
          margin: '8px 0'
        }}
        uiBackground={{
          textureMode: 'stretch',
          texture: {
            src: 'thumbnail.png',
          },
        }}
        uiText={{ value: 'SDK7 Smart Wearable', fontSize: 18 }}
      />
      <Label
        onMouseDown={() => {console.log('Player Position clicked !')}}
        value={`Connected Nearby Players:\n${playerList.join('\n')} + me`}
        fontSize={18}
        uiTransform={{ width: '100%', height: 30 } }
      />
      <Label
        onMouseDown={() => {console.log('# Cubes clicked !')}}
        value={`# Cubes: ${[...engine.getEntitiesWith(Cube)].length}`}
        fontSize={18}
        uiTransform={{ width: '100%', height: 30 } }
      />
      <Button
        uiTransform={{ width: 100, height: 40, margin: 8 }}
        value='Spawn cube'
        variant='primary'
        fontSize={14}
        onMouseDown={() => {
          createCube(1 + Math.random() * 8, Math.random() * 8, 1 + Math.random() * 8, false)
        }}
      />
     </UiEntity>
  </UiEntity>
)


// Function to update the player list
async function updatePlayerList() {
  const connectedPlayers = await getPlayersInScene({});
  playerList = connectedPlayers.players.map((player) => ({
    displayName: getPlayerDisplayName(player),
  }));
}

// Extract display name from player data (modify as per your player data structure)
function getPlayerDisplayName(player: any): string {
  return player.displayName || 'Unknown'; // Modify this based on your player data structure
}

// Call updatePlayerList to refresh the player list periodically (e.g., in onEnterSceneObservable)
onEnterSceneObservable.add(() => {
  updatePlayerList();
});

function getPlayerPosition() {
  const playerPosition = Transform.getOrNull(engine.PlayerEntity)
  if (!playerPosition) return ' no data yet'
  const { x, y, z } = playerPosition.position
  return `{X: ${x.toFixed(2)}, Y: ${y.toFixed(2)}, z: ${z.toFixed(2)} }`
}
*/