import { FC } from 'react'
import s from './successAndFail.module.scss'

type Props = {
  height?: string
  width?: string
}

export const Success: FC<Props> = ({ height = '30px', width = '30px' }) => {
  return (
    <div className={s.uiSuccess} style={{ height, width }}>
      <svg
        viewBox="0 0 90 90"
        version="1.1"
        xmlns="http://www.w3.org/2000/svg"
        xmlnsXlink="http://www.w3.org/1999/xlink"
      >
        <g id="Page-1" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
          <g id="Group-3" transform="translate(2.000000, 2.000000)">
            <circle id="Oval-2" stroke="rgb(165, 220, 134, 0.2)" stroke-width="4" cx="41.5" cy="41.5" r="41.5"/>
            <circle
              className={s.uiSuccessCircle}
              id="Oval-2"
              stroke="#A5DC86"
              stroke-width="4"
              cx="41.5"
              cy="41.5"
              r="41.5"
            />
            <polyline
              className={s.uiSuccessPath}
              id="Path-2"
              stroke="#A5DC86"
              stroke-width="8"
              points="19 38.8036813 31.1020744 54.8046875 63.299221 28"
            />
          </g>
        </g>
      </svg>
    </div>
  )
}

export const Fail: FC<Props> = ({ height = '30px', width = '30px' }) => {
  return (
    <div className={s.uiError} style={{ height, width }}>
      <svg
        viewBox="0 0 90 90"
        version="1.1"
        xmlns="http://www.w3.org/2000/svg"
        xmlnsXlink="http://www.w3.org/1999/xlink"
      >
        <g id="Page-1" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
          <g id="Group-2" transform="translate(2.000000, 2.000000)">
            <circle id="Oval-2" stroke="rgba(252, 191, 191, .5)" stroke-width="4" cx="41.5" cy="41.5" r="41.5"/>
            <circle
              className={s.uiErrorCircle}
              stroke="#F74444"
              stroke-width="4"
              cx="41.5"
              cy="41.5"
              r="41.5"
            />
            <path
              className={s.uiErrorLine1}
              d="M22.244224,22 L60.4279902,60.1837662"
              id="Line"
              stroke="#F74444"
              stroke-width="8"
              stroke-linecap="square"
            />
            <path
              className={s.uiErrorLine2}
              d="M60.755776,21 L23.244224,59.8443492"
              id="Line"
              stroke="#F74444"
              stroke-width="8"
              stroke-linecap="square"
            />
          </g>
        </g>
      </svg>
    </div>
  )
}
