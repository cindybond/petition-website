
import { create } from 'zustand';
import axios from "axios";

interface UserState {
    user: userReturn;
    setUser: (user:userReturn) => void;
    removeUser:(user:userReturn) => void;
}
const url = 'http://localhost:4941/api/v1'
const getLocalStorage = (key: string): userReturn => JSON.parse(window.localStorage.getItem(key) as string);
const setLocalStorage = (key: string, value:userReturn) => window.localStorage.setItem(key, JSON.stringify(value));

const useStore = create<UserState>((set) => ({
    user: getLocalStorage('user') || {userId:-1, token: ""},
    setUser:(user:userReturn) => set(() => {
        console.log('logged in')
        setLocalStorage('user', user)
        return { user: user}
    }),
    removeUser: (user: userReturn) => {
        console.log(user.token)
        axios.post(url + '/users/logout', '',{headers: {'X-Authorization': user.token}})
            .then((response) => {
                console.log(response);
                localStorage.clear();
                set({ user: { userId: -1, token: "" } });
            })
            .catch((error) => {
                console.error("Logout failed:", error);
            });
    }
}))

export default useStore;