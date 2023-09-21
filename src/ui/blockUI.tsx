import { Color4, Vector3 } from '@dcl/sdk/math'
import ReactEcs, { Button, Label, ReactEcsRenderer, UiEntity, Position,UiBackgroundProps } from '@dcl/sdk/react-ecs'
import { addLineBreak, dimensions } from './ui'
import { hidePlayer, playerToBlock, toggleEyeClosed, toggleEyeOpen } from '../block'

export let showBlockUI = false

export function displayBlockUI(value:boolean){
  showBlockUI = value
}

export function createBlockUI(){
  return (
    <UiEntity key={"blockui"}
      uiTransform={{
        width: '100%',
        height: '100%',
        display: showBlockUI ? 'flex': 'none',
        flexDirection:'column',
        justifyContent:'center',
        alignItems:'center',
      }}
    >
          <UiEntity
          uiTransform={{
            width: dimensions.width * 0.40,
            height: dimensions.height * 0.25,
            display: 'flex',
            flexDirection:'column',
            justifyContent:'center',
            alignContent:'center',
            alignItems:'center'
          }}
            uiBackground={{color:Color4.Black()}}
        >

          <UiEntity
              uiTransform={{
                width: '100%',
                height: '60%',
                display: 'flex',
                flexDirection:'column',
                alignContent:'center',
                justifyContent:'center'
              }}
            >
        <Label
          value={"Are you sure you want to block\n" + playerToBlock.name}
          color={Color4.White()}
          fontSize={49}
          font="serif"
          textAlign="middle-center"
        />
        </UiEntity>

        <UiEntity
              uiTransform={{
                width: '100%',
                height: '40%',
                display: 'flex',
                flexDirection:'row',
                alignContent:'center',
                justifyContent:'center'
              }}
            >

          <UiEntity
              uiTransform={{
                width: '50%',
                height: '40%',
                display: 'flex',
                flexDirection:'row',
                alignContent:'center',
                justifyContent:'center'
              }}
            >
        <Button
            value= "Cancel"
            fontSize={50}
            uiTransform={{ width: '50%', height: '100%' }}
            onMouseDown={() => {
              displayBlockUI(false)
              toggleEyeOpen()
             } }
          />
        </UiEntity>


        <UiEntity
              uiTransform={{
                width: '50%',
                height: '40%',
                display: 'flex',
                flexDirection:'row',
                alignContent:'center',
                justifyContent:'center'
              }}
            >
        <Button
            value= "Block"
            fontSize={50}
            uiTransform={{ width: '50%', height: '100%' }}
            onMouseDown={() => {
              hidePlayer(playerToBlock.userId, true)
              displayBlockUI(false)
              toggleEyeClosed()
             } }
          />
        </UiEntity>

        </UiEntity>

    </UiEntity>
      </UiEntity>
)
}