type UseCloseWindowsType = {
    handleCloseConfigWindow: () => void
}

export default function useCloseWindows():UseCloseWindowsType {

    function handleCloseConfigWindow() {
        if (!!window) {
            window.api.configurationWindowCancel();
        }
    }

    return {
        handleCloseConfigWindow,
    }
}