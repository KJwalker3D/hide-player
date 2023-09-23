import { getPlayersInScene, PlayersGetUserDataResponse, getConnectedPlayers, getPlayerData } from '~system/Players'
import { AvatarAnchorPointType, AvatarAttach, AvatarModifierArea, Material, Billboard, BillboardMode, AvatarModifierType, InputAction, MeshCollider, MeshRenderer, Transform, engine, pointerEventsSystem} from '@dcl/sdk/ecs'
import { Vector3, Color4 } from '@dcl/sdk/math'
import { getUserData } from '~system/UserIdentity'
import { displayBlockUI } from './ui/blockUI'

let childEntity = engine.addEntity()
let players:Map<string, any> = new Map()
let userId:string = ""
let excludedList:string[] = []
let hideEntity = engine.addEntity()
let updateHide = false

const eyeOpen = "images/eyeOpen.png";
const eyeSelected = "images/eyeSelected.png";
const eyeClosed = "images/eyeClosed.png";

export let playerToBlock:any = {}


let tempBlockList:any[] = [
    // "0xa363d0dbe726be787972b125ebc3b0b3db1f248c"//
    // "0xb556db2bc04a0f44272444decdbb373fd33da2b4"
]

export function toggleEyeOpen() {

    Material.setPbrMaterial(childEntity, {
        texture: Material.Texture.Common({
        src: eyeOpen,
        }),
        roughness: 1,
        specularIntensity: 0,
        emissiveTexture: Material.Texture.Common({src: eyeOpen}),
        emissiveColor: Color4.White(),
        emissiveIntensity: 1.5

    })
}

export function toggleEyeSelected() {
    
    Material.setPbrMaterial(childEntity, {
        texture: Material.Texture.Common({
            src: eyeSelected
        }),
        roughness: 1,
        specularIntensity: 0,
        emissiveTexture: Material.Texture.Common({src: eyeSelected}),
        emissiveColor: Color4.White(),
        emissiveIntensity: 1.5
    })
}

export function toggleEyeClosed() {
    
    Material.setPbrMaterial(childEntity, {
        texture: Material.Texture.Common({
            src: eyeClosed
        }),
        roughness: 1,
        specularIntensity: 0,
        emissiveTexture: Material.Texture.Common({src: eyeClosed}),
        emissiveColor: Color4.White(),
        emissiveIntensity: 1.5
    })
}

export async function startExperience() {
    let userData = await getUserData({})
    console.log('user data is', userData)
    userId = userData.data!.userId

    engine.addSystem(HideSystem)
}

function addHoverObject(player:string, name:string){
    if(userId !== player){
        const parentEntity = engine.addEntity()
    
        AvatarAttach.create(parentEntity,{
            anchorPointId: AvatarAnchorPointType.AAPT_POSITION,
            avatarId: player
        })
    
        let childEntity = engine.addEntity()
    
        MeshRenderer.setPlane(childEntity)
        MeshCollider.setPlane(childEntity)
        Billboard.create(childEntity)
    
        Transform.create(childEntity, {
            scale: Vector3.create(0.2, 0.2, 0.2),
            position: Vector3.create(0, 3, 0),
            parent: parentEntity,
        })

        Material.setPbrMaterial(childEntity, {
            texture: Material.Texture.Common({
                src: eyeOpen
            }),
            roughness: 1,
            specularIntensity: 0,
            emissiveTexture: Material.Texture.Common({src: eyeOpen}),
            emissiveColor: Color4.White(),
            emissiveIntensity: 1.5
        })
    
        players.set(player, {
            parent:parentEntity,
            child: childEntity,
            name:name
        })
    
        pointerEventsSystem.onPointerDown(
            {
            entity: childEntity,
            opts: {
                button: InputAction.IA_POINTER,
                hoverText: 'Block',
                maxDistance:10
              }
            },
            function () {
              console.log("clicked player", player)
              playerToBlock = {userId:player, name:name}
              displayBlockUI(true)
              toggleEyeSelected()
            }
        )
    }
}

export function hidePlayer(player:string, update?:boolean){
    console.log('hiding player', player)

    if(players.has(player)){
        let p = players.get(player)

        engine.removeEntity(p.parent)
        engine.removeEntity(p.child)

        if(!p.hiding){
            addHideArea(player)
        }
    }
    else{
        addHideArea(player)
    }
}

function addHideArea(player:string){
    let data:any = {}

    let hide = engine.addEntity()
    AvatarModifierArea.createOrReplace(hide, {
        area: Vector3.create(1, 2, 1),
        modifiers: [AvatarModifierType.AMT_HIDE_AVATARS],
        excludeIds: [userId]
    })

    AvatarAttach.createOrReplace(hide,{
        anchorPointId: AvatarAnchorPointType.AAPT_POSITION,
        avatarId: player
    })

    data.hiding = hide
    players.set(player, data)
}

function removeHidePlayer(player:string){
    let p = players.get(player)

    engine.removeEntity(p.parent)
    engine.removeEntity(p.child)

    if(p.hiding){
        engine.removeEntity(p.hiding)
    }

    console.log('removed hide player entity from scene', p.hiding)//
}

async function refreshBlockedPlayers(){
    try{
        console.log('refreshing scene players')

        let connectedPlayers = await getPlayersInScene({});
        console.log('connected players is', connectedPlayers)
        connectedPlayers.players.forEach(async (player, i) => {
            if(tempBlockList.find((p)=> p === player.userId)){
                console.log('player is in scene and on block list, hide them')
                hidePlayer(player.userId)
            }
            else{
                if(!players.has(player.userId)){
                    let res = await fetch("https://peer.decentral.io/lambdas/profile/"+player.userId)
                    let json = await res.json()

                    let name:string = "Guest"
                    if(json.avatars.length > 0){
                        name = json.avatars[0].name
                    }
                    addHoverObject(player.userId, name)
                }
            }   
        })
        console.log('players tracked', players)


        players.forEach((data:any,key:string)=>{
            console.log('current player in scene', key)
            if(connectedPlayers.players.find((p)=> p.userId !== key)){
                removeHidePlayer(key)
            }
        })
    }
    catch(e){
        console.log('error refreshing blocked players', e)
    }
}

var timer = 0;
function HideSystem(dt: number) {

    if (timer > 0) {
        timer -= dt
    } else {
        timer = 10
        refreshBlockedPlayers()
    }//
}  

// export async function hidePlayer() {
    
//     let userData = await getUserData({})
//     console.log('user Data:', userData);
//     userId = userData.data?.userId;

//    const { realmInfo } = await getRealm({})
// //    const url = `${realmInfo!.baseUrl}/lambdas/profile/${userId}`

//    const url = `https://peer.decentral.io/lambdas/profile/0xAaBe0ecFaf9e028d63cf7ea7E772CF52d662691A`

//    console.log('using URL: ', url)
 
//    try {
//     // let response = await fetch (url)
//     // let json = await response.json()
    
//     let json:any = {
//         avatars:[
//             {name:"lastraum"}
//         ]
//     }
    
//      console.log('full response: ', json)
//     //  console.log(json.avatars[0].muted) // muted list
//     //  console.log(json.avatars[0].blocked) // muted list

//      let mutedList:any[] = json.avatars[0].muted ? json.avatars[0].muted : [];
//      let blockedList:any[] = json.avatars[0].blocked ? json.avatars[0].blocked : [];
//     //  mutedList.push("0x1f478b6e281addb004012098e3952a0e92c6783f11")
//     //  blockedList.push("0x1f478b6e281addb004012098e3952a0e92c6783f1")
    
//      let excludedList: any = []

//      console.log("blockedlist", blockedList)

//      // if a player is in the scene and not on the muted list add them to the exclude
//     let connectedPlayers = await getPlayersInScene({});
//     connectedPlayers.players.forEach ((player, i) => {
//         if(!blockedList.find((p: any) => p === player.userId) && !mutedList.find((p: any) => p === player.userId)) {
//             excludedList.push(player.userId)           
//         }
//     })

//     console.log("excluded list", excludedList)
    
//     const player = engine.PlayerEntity;
//     AvatarModifierArea.createOrReplace(entity, {
//         area: Vector3.create(100, 100, 100),
//         modifiers: [AvatarModifierType.AMT_HIDE_AVATARS],
//         excludeIds: excludedList
//     })

//     Transform.createOrReplace(entity, {
//         position: Vector3.Zero(),
//         parent: player
//     })


//    } catch {
//      console.log('an error occurred while reaching for player data')
//    }
 
// }


// var timer = 0;
// function HideSystem(dt: number) {

//     if (timer > 0) {
//         // count down
//         timer -= dt
//         //console.log(timer)
//     } else {
//         timer = 10
//         console.log('timer finished')
//         hidePlayer()
//     }
// }  


