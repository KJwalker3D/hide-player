import { getPlayersInScene, PlayersGetUserDataResponse, getConnectedPlayers, getPlayerData } from '~system/Players'
import { AvatarAttach, executeTask } from '@dcl/sdk/ecs'
import { onEnterSceneObservable, onLeaveSceneObservable} from '@dcl/sdk/observables'
import { onPlayerClickedObservable} from '@dcl/sdk/observables'
import { engine, AvatarModifierArea, AvatarModifierType, Transform } from '@dcl/sdk/ecs'
import { Vector3 } from '@dcl/sdk/math'
import { getUserData } from '~system/UserIdentity'
import { getRealm } from '~system/Runtime'



const entity = engine.addEntity()
let userId: any;

export function startExperience() {

    engine.addSystem(HideSystem)
}

export async function hidePlayer() {
    
    let userData = await getUserData({})
    console.log('user Data:', userData);
    userId = userData.data?.userId;

   const { realmInfo } = await getRealm({})
   const url = `${realmInfo!.baseUrl}/lambdas/profile/${userId}`

   //const url = `https://peer.decentral.io/lambdas/profile/0xAaBe0ecFaf9e028d63cf7ea7E772CF52d662691A`

   console.log('using URL: ', url)
 
   try {
    let response = await fetch (url)
    let json = await response.json()
    
     console.log('full response: ', json)
     console.log(json.avatars[0].muted) // muted list

     let mutedList = json.avatars[0].muted;
     //mutedList.push("0x0206e5c67cebe91ad993e5fbcdd0c50e38b2fd00")
     //mutedList.push("0x258021aa4726a79685d7b14bac29597291a01614")
    
     let excludedList: any = []



     // if a player is in the scene and not on the muted list add them to the exclude
    let connectedPlayers = await getPlayersInScene({});
    console.log(connectedPlayers)
    connectedPlayers.players.forEach ((player, i) => {

        if (!mutedList.find((p: any) => p === player.userId)) {
            
            excludedList.push(player.userId)            
        }
    })


    const player = engine.PlayerEntity;
    AvatarModifierArea.createOrReplace(entity, {
        area: Vector3.create(100, 100, 100),
        modifiers: [AvatarModifierType.AMT_HIDE_AVATARS],
        excludeIds: excludedList
    })

    Transform.createOrReplace(entity, {
        position: Vector3.Zero(),
        scale: Vector3.create(0.75, 1.8, 0.25),
        parent: player
    })


   } catch {
     console.log('an error occurred while reaching for player data')
   }
 
}


var timer = 0;
function HideSystem(dt: number) {

    if (timer > 0) {
        // count down
        timer -= dt
        //console.log(timer)
    } else {
        timer = 10
        console.log('timer finished')
        hidePlayer()

    }

}  


