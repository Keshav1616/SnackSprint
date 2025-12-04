import { useDispatch, useSelector } from 'react-redux'
import {login,logout,toggleFavorite,saveAddress, setCurrentAddress} from '../store/appSlice'


export function useApp() {
 const app = useSelector(state => state.app)
 const dispatch = useDispatch()


 return {
 ...app,
 login: (user) => dispatch(login(user)),
 logout: () => dispatch(logout()),
toggleFavorite: (restaurant) => dispatch(toggleFavorite(restaurant)),
saveAddress: (address) => dispatch(saveAddress(address)),
setCurrentAddress: (address) => dispatch(setCurrentAddress(address))
}
}


export function useCart() {
 return useSelector(state => state.cart)
}


export function useDispatchStore() {
 return useDispatch()
} 