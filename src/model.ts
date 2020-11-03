export interface Action {
    method: () => void;
    title: string;
    icon: {
        name: string;
        type: string;
    },
    color?: string;
}
