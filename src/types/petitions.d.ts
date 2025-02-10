type Petition = {
    petitionId: number,
    title: string,
    categoryId: number,
    creationDate: string,
    ownerId: number,
    ownerFirstName: string,
    ownerLastName: string,
    numberOfSupporters: number,
    supportingCost: number
}

type supportTierPost = {
    title: string,
    description: string
    cost: number
}

type supportTier = {
    supportTierId: number,
} & supportTierPost

type Categories = {
    id: number,
    name: string
}

type postSupport = {
    supportTierId: number,
    message: string
}

type supporter = {
    supportId: number,
    supporterId: number,
    supporterFirstName: string,
    supporterLastName: string,
    timestamp: string
} & postSupport

type PetitionFull = {
    description: string,
    moneyRaised: number,
    supportTiers: supportTier[]
} & petition

type createPetition = {
    title: string,
    description: string,
    categoryId: number,
    supportTiers: supportTierPost[]
}