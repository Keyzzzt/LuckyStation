// /* eslint-disable jsx-a11y/anchor-is-valid */
// import React, { useEffect, useRef, useState } from 'react'
// import './DropdownMenu.scss'
// import { CSSTransition } from 'react-transition-group'
// import { ReactComponent as BellIcon } from '../svg/bell.svg'
// import { ReactComponent as ArrowIcon } from '../svg/arrow.svg'
// import { ReactComponent as CaretIcon } from '../svg/caret.svg'
// import { ReactComponent as ChevronIcon } from '../svg/chevron.svg'
// import { ReactComponent as CogIcon } from '../svg/cog.svg'
// import { ReactComponent as MessengerIcon } from '../svg/messenger.svg'
// import { ReactComponent as PlusIcon } from '../svg/plus.svg'
// import { ReactComponent as BoltIcon } from '../svg/bolt.svg'
// import { Link } from 'react-router-dom'

// export const Menu: React.FC = () => {
//   return (
//     <Navbar>
//       <NavItem icon={<PlusIcon />} />
//       <NavItem icon={<BellIcon />} />
//       <NavItem icon={<MessengerIcon />} />
//       <NavItem icon={<CogIcon />}>
//         <DropdownMenu></DropdownMenu>
//       </NavItem>
//     </Navbar>
//   )
// }

// const Navbar: React.FC = ({ children }) => {
//   return (
//     <nav className="navbar">
//       <ul className="navbar-nav">{children}</ul>
//     </nav>
//   )
// }

// const NavItem: React.FC<any> = (props) => {
//   const [open, setOpen] = useState(false)

//   // TODO: Закрывать меню при нажатии на esc либо вне меню

//   return (
//     <li className="nav-item">
//       <a href="#" className="icon-button" onClick={() => setOpen(!open)}>
//         {props.icon}
//       </a>

//       {open && props.children}
//     </li>
//   )
// }

// const DropdownMenu = () => {
//   const [activeMenu, setActiveMenu] = useState('main')
//   const [menuHeight, setMenuHeight] = useState(null as any)
//   const dropdownRef = useRef(null)

//   useEffect(() => {
//     // @ts-ignore
//     setMenuHeight(dropdownRef.current.firstChild.offsetHeight)
//   }, [])

//   function calcHeight(el: any) {
//     const height = el.offsetHeight
//     setMenuHeight(height)
//   }
//   function DropdownItem(props: any) {
//     return (
//       <Link to={props.link} className="menu-item" onClick={() => props.goToMenu && setActiveMenu(props.goToMenu)}>
//         <span className="icon-button">{props.leftIcon}</span>
//         {props.children}
//         <span className="icon-right">{props.rightIcon}</span>
//       </Link>
//     )
//   }
//   return (
//     <div className="dropdown" style={{ height: menuHeight }} ref={dropdownRef}>
//       <CSSTransition in={activeMenu === 'main'} timeout={500} classNames="menu-primary" unmountOnExit onEnter={calcHeight}>
//         <div className="menu">
//           <DropdownItem leftIcon={<BellIcon />} link="/dashboard">
//             Dashboard
//           </DropdownItem>
//           <DropdownItem leftIcon={<CogIcon />} rightIcon={<ChevronIcon />} goToMenu="settings">
//             Settings
//           </DropdownItem>
//           <DropdownItem leftIcon="🦧" rightIcon={<ChevronIcon />} goToMenu="animals">
//             Animals
//           </DropdownItem>
//         </div>
//       </CSSTransition>

//       <CSSTransition in={activeMenu === 'settings'} timeout={500} classNames="menu-secondary" unmountOnExit onEnter={calcHeight}>
//         <div className="menu">
//           <DropdownItem goToMenu="main" leftIcon={<ArrowIcon />}>
//             <h2>My Tutorial</h2>
//           </DropdownItem>
//           <DropdownItem leftIcon={<BoltIcon />}>HTML</DropdownItem>
//           <DropdownItem leftIcon={<BoltIcon />}>CSS</DropdownItem>
//           <DropdownItem leftIcon={<BoltIcon />}>JavaScript</DropdownItem>
//           <DropdownItem leftIcon={<BoltIcon />}>Awesome!</DropdownItem>
//         </div>
//       </CSSTransition>

//       <CSSTransition in={activeMenu === 'animals'} timeout={500} classNames="menu-secondary" unmountOnExit onEnter={calcHeight}>
//         <div className="menu">
//           <DropdownItem goToMenu="main" leftIcon={<ArrowIcon />}>
//             <h2>Animals</h2>
//           </DropdownItem>
//           <DropdownItem leftIcon="🦘">Kangaroo</DropdownItem>
//           <DropdownItem leftIcon="🐸">Frog</DropdownItem>
//           <DropdownItem leftIcon="🦋">Horse?</DropdownItem>
//           <DropdownItem leftIcon="🦔">Hedgehog</DropdownItem>
//           <DropdownItem leftIcon="🦔">Hedgehog</DropdownItem>
//           <DropdownItem leftIcon="🦔">Hedgehog</DropdownItem>
//           <DropdownItem leftIcon="🦔">Hedgehog</DropdownItem>
//           <DropdownItem leftIcon="🦔">Hedgehog</DropdownItem>
//           <DropdownItem leftIcon="🦔">Hedgehog</DropdownItem>
//           <DropdownItem leftIcon="🦔">Hedgehog</DropdownItem>
//           <DropdownItem leftIcon="🦔">Hedgehog</DropdownItem>
//         </div>
//       </CSSTransition>
//     </div>
//   )
// }
