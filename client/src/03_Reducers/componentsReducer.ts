import { API } from '../API'
import { BaseThunkType, InferActionTypes, IValErrMsg } from '../05_Types/01_Base'
import { ConfigResponseType } from '../05_Types/ResponseTypes'

type ThunkType = BaseThunkType<ActionType>
type InitialStateType = typeof initialState
type ActionType = InferActionTypes<typeof actions>

// TODO REFACTOR TO config

const initialState = {
  header: {
    title: 'Station',
    subtitle: 'Craft furniture shop',
    menuItems: [
      { title: 'Products', link: '/products', type: 'public' },
      { title: 'Services', link: '/services', type: 'public' },
      { title: 'About', link: '/about', type: 'public' },
      { title: 'Help', link: '/help', type: 'public' },
      { title: 'Cart', link: '/cart', type: 'public' },
      { title: 'Login', link: '/signin', type: 'public' },
      { title: 'Logout', link: '/', icon: false, type: 'private' },
      { title: 'Profile', link: '/profile', type: 'private' },
      { title: 'Admin', link: '/dashboard', type: 'admin' },

    ],
  },
  landingPage: {
    hero: {
      title: 'Crafted with care',
      subTitle: 'Safe and sound',
      text: 'Organic baby accessories, sustainably made',
      buttonText: 'Shop now'
    },
    bestProducts: {
      title: 'Be inspired',
      subTitle: 'Check our brand new furniture',
      buttonText: 'View all products'
    },
    productPromo: [
      {
        title: 'WHITE NOISE SPEAKER',
        description: ['Babies like white noise. They are used to it. Before the baby is born, it spends its days and nights inside the womb, closely enveloped by the soothing human hum of its mother\'s body. The beating of the mother\'s heart, the sound of blood rushing through her body, and the rhythmic breathing combine to create a reassuring mix of sounds.','Our brand-new Moonboon White Noise Speaker comes with 10 relaxing sleep sounds, including womb sounds, brown noise, white noise and pink noise.'],
        image: '',
        buttonText: 'Explore',
        path: '',
      },
      {
        title: 'WHITE NOISE SPEAKER',
        description: ['Babies like white noise. They are used to it. Before the baby is born, it spends its days and nights inside the womb, closely enveloped by the soothing human hum of its mother\'s body. The beating of the mother\'s heart, the sound of blood rushing through her body, and the rhythmic breathing combine to create a reassuring mix of sounds.','Our brand-new Moonboon White Noise Speaker comes with 10 relaxing sleep sounds, including womb sounds, brown noise, white noise and pink noise.'],
        image: '',
        buttonText: 'Explore',
        path: '',
      },
    ]
  }


}

export const componentsReducer = (state = initialState, action: ActionType): InitialStateType => {
  switch (action.type) {
    // case 'CONFIG_SUCCESS':
    //   return { ...initialState, config: action.payload }
    // case 'CONFIG_FAIL':
    //   return { ...initialState, fail: action.payload }
    default:
      return state
  }
}

export const actions = {
  success: (config: ConfigResponseType) => ({ type: 'CONFIG_SUCCESS' as const, payload: config }),
  fail: (errMessage: string) => ({ type: 'CONFIG_FAIL' as const, payload: errMessage }),
}

// export function configThunk(): ThunkType {
//   return async function (dispatch) {
//     try {
//       const { data } = await API.config.getConfig()
//
//       dispatch(actions.success(data))
//     } catch (err: any) {
//       const { errors, error }: { errors: IValErrMsg[]; error: string } = err.response.data
//       if (errors.length > 0) {
//         const errMsg = errors.map(e => e.msg).join('; ')
//         dispatch(actions.fail(errMsg))
//         return
//       }
//       dispatch(actions.fail(error))
//     }
//   }
// }
