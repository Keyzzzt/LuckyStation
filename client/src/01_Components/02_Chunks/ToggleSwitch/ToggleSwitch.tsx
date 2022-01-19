import { FC, useState } from 'react'
import { useDispatch } from 'react-redux'
import styles from './ToggleSwitch.module.scss'

export const ToggleSwitch: FC<any> = ({ toggle }) => {
  const [switchOn, setSwitchOn] = useState(false)
  const switchOnClass = switchOn ? styles.on : ''
  const dispatch = useDispatch()
  const switchToggleHandler = () => {
    setSwitchOn((prev) => !prev)
    dispatch(toggle)
  }
  return (
    <div>
      <div className={`${styles.switch} ${switchOnClass}`} onClick={switchToggleHandler}>
        <div className={styles.switch__thumb}></div>
      </div>
    </div>
  )
}
