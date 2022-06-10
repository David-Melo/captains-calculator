import { mergeDeep } from "utils/objects";
import { GenericError } from "./_types";

type GenericDictionary = {
    [index: string]: any
}

type ModuleOptions<T,V,I> = {
    filter?: V;
    default?: I;
    sortKey?: keyof T;
    sortOrder?: 'asc' | 'desc';
    limit?: number;
}

export type GenericModel = {
    id: string;
}

export type ModelDictionary<T extends GenericModel> = {
    [index: string]: T;
}

export type ModelMeta<T> = {
    total: number;
    limit: number;
    offset: number;
    sortKey: keyof T;
    sortOrder: 'asc' | 'desc';
    page: number;
}

export type SetMetaInput<T> = Partial<ModelMeta<T>>;

export class Module<T extends GenericModel, V extends GenericDictionary, I extends GenericDictionary> {

    public errors: GenericError[] = []
    public loading: boolean = false
    public loadingMore: boolean = false
    public meta: ModelMeta<T> = {
        limit: 10,
        total: 0,
        offset: 0,
        sortKey: 'id',
        sortOrder: 'asc', 
        page: 1
    }

    public defaultLimit: number = 10;
    public defaultSortKey: ModelMeta<T>['sortKey'] = 'id';
    public defaultSortOrder: ModelMeta<T>['sortOrder'] = 'asc';

    public filter: V | undefined;
    public default: I | undefined;

    public items: ModelDictionary<T> = {}
    public currentItemId: T['id'] | null = null

    constructor(options?: ModuleOptions<T,V,I>) {
        if(options) {
            if(options.filter) {
                this.filter = options.filter
            }
            if(options.default) {
                this.default = options.default
            }
            if(options.limit) {
                this.defaultLimit = options.limit
                this.meta.limit = options.limit
            } else {
                this.meta.limit = this.defaultLimit
            }
            if(options.sortKey) {
                this.defaultSortKey = options.sortKey
                this.meta.sortKey = options.sortKey
            } else {
                this.meta.sortKey = this.defaultSortKey 
            }
            if(options.sortOrder) {
                this.defaultSortOrder = options.sortOrder
                this.meta.sortOrder = options.sortOrder
            } else {
                this.meta.sortOrder = this.defaultSortOrder
            }
        }
    }

    public mergeQueryPayload(payload: V) {
        if (!this.filter) return payload;
        return mergeDeep(payload, this.filter)
    }

    public mergeCreatePayload<X extends I>(payload: I): X {
        if (!this.default) return payload as X;
        return mergeDeep(payload, this.default) as X
    }

    get getDefaults() {
        return {
            limit: this.defaultLimit,
            sortOrder: this.defaultSortOrder
        } 
    }

    get currentItem(): T | null {
        return this.currentItemId && this.items[this.currentItemId] ? this.items[this.currentItemId] : null
    }

    get itemsList(): T[] {
        return Object.values(this.items) 
    }

    public selectItem(id: T['id']): void {
        this.currentItemId = id
    }

    public set setMeta(newMeta: SetMetaInput<T>) {
        this.meta = {
            ...this.meta,
            ...newMeta
        }
    }

}