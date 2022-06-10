import { Button, Center } from "@mantine/core"
import { ModelMeta } from "state/Module"
import { GenericDictionary } from "state/_types"

type LoadMoreProps<T> = {
    meta: ModelMeta<T>;
    loading: boolean;
    onLoadMore(): void;
}

function LoadMoreButton<T extends GenericDictionary>({
    meta,
    loading,
    onLoadMore
}: React.PropsWithChildren<LoadMoreProps<T>>): React.ReactElement | null {

    const handleLoadMore = () => {
        onLoadMore()
    }

    if(meta.total<=meta.page*meta.limit) return null;

    return (
        <Center my="md">
            <Button
                variant="outline"
                color="gray"
                loading={loading}
                onClick={handleLoadMore}
            >
                Load More...
            </Button>
        </Center>
    )

}

export default LoadMoreButton