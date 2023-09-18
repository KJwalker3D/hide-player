import { getPlayersInScene, PlayersGetUserDataResponse, getConnectedPlayers, getPlayerData } from '~system/Players'
import { executeTask } from '@dcl/sdk/ecs'
import { onEnterSceneObservable, onLeaveSceneObservable} from '@dcl/sdk/observables'
import { onPlayerClickedObservable} from '@dcl/sdk/observables'
import { customPrompt } from './ui'

/// Simplest solution is to
/// Hide avatar by clicking on it


onPlayerClickedObservable.add((clickEvent) => {
  console.log("Clicked ", clickEvent.userId, " details: ", clickEvent.ray);
  // Display a pop-up "Hide this player? Yes / No"
  customPrompt.show()

  // Cross reference userId value with connected players to access data to hide a player 


})

// To hide the player we could add a hide avatar mod area to the position of the invisible area
// This will hide us too,..
// Ideally AvatarShape.hide would be a thing and we could attach it to the userId


/// V2
/*

export interface Player {
    userId: string;
    isVisible: boolean;
    displayName: string;
  }
  
  interface PlayerDataResponse {
    name: string;
    // Add other properties as needed to match the actual response
  }
  
  export let playerList: Player[] = [];
  

  

  executeTask(async () => {
    let connectedPlayers = await getPlayersInScene({});
    const playerPromises = connectedPlayers.players.map(async (player) => {
      const userData: PlayersGetUserDataResponse = await getPlayerData({ userId: player.userId });
      return {
        userId: player.userId,
        isVisible: true,
        displayName: userData.data?.displayName || 'Unknown', // Use the actual property
      };
    });
  
    playerList = await Promise.all(playerPromises);
  
    // Log players and their display names
    console.log('List of nearby players:', playerList);
  });
  
  // Event when player enters scene
  onEnterSceneObservable.add((player) => {
    console.log('player entered scene: ', player.userId);
    // You can add the player to the playerList here if needed.
  });
  
  // Event when player leaves scene
  onLeaveSceneObservable.add((player) => {
    console.log('player left scene: ', player.userId);
    // You can remove the player from the playerList here if needed.
  });

*/





/// V1
/*
interface Player {
    userId: string;
    isVisible: boolean;
}

export let playerList: Player[] = [];

// Get all players already in scene
executeTask(async () => {
  let connectedPlayers = await getPlayersInScene({})
  connectedPlayers.players.forEach((player) => {
    console.log('player is nearby: ', player.displayName);
    playerList = connectedPlayers.players.map((player) => ({
        userId: player.userId,
        isVisible: true, //starts true by default
    }));
    
    // Log players
    console.log('List of nearby players:', playerList);
  });
  // Toggle player visibility 
  
  function togglePlayerVisibility(userId: string) {
      const player = playerList.find((p) => p.userId === userId);
      if (player) {
          player.isVisible = !player.isVisible
      }
  } 
})

// Event when player enters scene
onEnterSceneObservable.add((player) => {
  console.log('player entered scene: ', player.userId)
})

// Event when player leaves scene
onLeaveSceneObservable.add((player) => {
  console.log('player left scene: ', player.userId)
})
*/
