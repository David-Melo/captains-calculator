import { Icon } from "@iconify/react"
import { Alert, List } from "@mantine/core"
import { GenericError } from "state/_types"

const ModuleErrors: React.FC<{ errors: GenericError[] }> = ({ errors }) => {
    if (!errors.length) return null
    return (
        <Alert icon={<Icon icon="ph:alien-bold" width="24" />} title="Oops! We had an error while getting this for you." color="red" variant="outline">
            <List size="sm">
                {errors.map((error,key)=><List.Item key={key}><strong>{error.code}</strong> - {error.text}</List.Item>)}
            </List>
        </Alert>
    )
}

export default ModuleErrors