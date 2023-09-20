

export let showMenu = false
export let showCursor = false
export let currentMenuView = "quests"

export function displayMenu(value:boolean){
    showMenu = value
}

export function displayMenuView(view:string){
    currentMenuView = view
}

export function displayCursor(value:boolean){
    showCursor = value
}

export function getButtonState(view:string, button:string){
    return getImageAtlasMapping(
            
        view === button ?   
        {
        atlasHeight:1024,
        atlasWidth:1024,
        sourceTop:95,
        sourceLeft:8,
        sourceWidth:240,
        sourceHeight:79
      }

      :

      {
        atlasHeight:1024,
        atlasWidth:1024,
        sourceTop:95,
        sourceLeft:264,
        sourceWidth:240,
        sourceHeight:79
      }
      
      )
}

export function getSquareButtonState(view:string, button:string){
  return getImageAtlasMapping(
          
      view === button ?   
      {
      atlasHeight:1024,
      atlasWidth:1024,
      sourceTop:7,
      sourceLeft:775,
      sourceWidth:240,
      sourceHeight:79
    }

    :

    {
      atlasHeight:1024,
      atlasWidth:1024,
      sourceTop:7,
      sourceLeft:263,
      sourceWidth:240,
      sourceHeight:79
    }
    
    )
}

export function getImageAtlasMapping(data?: ImageAtlasData): number[] {
    if (!data) return []
    const {
      atlasWidth,
      atlasHeight,
      sourceWidth,
      sourceHeight,
      sourceTop,
      sourceLeft,
    } = data
  
    return [
      sourceLeft / atlasWidth, (atlasHeight - sourceTop - sourceHeight) / atlasHeight,
      sourceLeft / atlasWidth, (atlasHeight - sourceTop) / atlasHeight,
      (sourceLeft + sourceWidth) / atlasWidth, (atlasHeight - sourceTop) / atlasHeight,
      (sourceLeft + sourceWidth) / atlasWidth, (atlasHeight - sourceTop - sourceHeight) / atlasHeight,
    ]
  }
  
  export type ImageAtlasData = {
    atlasWidth: number;
    atlasHeight: number;
    sourceWidth: number;
    sourceHeight: number;
    sourceLeft: number;
    sourceTop: number;
  };