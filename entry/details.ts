import { ethers } from 'ethers'
import { PrismaClient } from '@prisma/client'
import { UndefinedOr } from '@devprotocol/util-ts'
import { getIdFromGraphQL } from '../common/github'
import { getRewardFromGithubId } from '../common/reward'
import {
	insertEntry,
	isAlreadyClaimed,
	updateEntry,
	getEntry,
} from '../common/db'

export const getAirdropIfo = async function (
	client: PrismaClient,
	params: ParamsOfEntryApi
): Promise<UndefinedOr<AirdropInfo>> {
	const { accessToken } = params
	const githubId = await getIdFromGraphQL(accessToken)
	const isClaimed = await isAlreadyClaimed(client, githubId)
	const result = isClaimed
		? undefined
		: await createAirDropInfo(client, githubId, params.sign)
	return result
}

const createAirDropInfo = async function (
	client: PrismaClient,
	githubId: string,
	sign: string
): Promise<UndefinedOr<AirdropInfo>> {
	const address = ethers.utils.verifyMessage(githubId, sign)
	const [rewardRecord, totalContributions] = await getRewardFromGithubId(
		client,
		githubId
	)
	return typeof rewardRecord === 'undefined'
		? undefined
		: {
				githubId: githubId,
				address: address,
				sign: sign,
				rewardId: rewardRecord.id,
				contributionCount: totalContributions,
		  }
}

export const addEntryInfo = async function (
	client: PrismaClient,
	info: AirdropInfo
): Promise<boolean> {
	const currentData = await getEntry(client, info.githubId)
	const result =
		typeof currentData === 'undefined'
			? await insertEntry(
					client,
					info.githubId,
					info.address,
					info.sign,
					info.rewardId,
					info.contributionCount
			  )
			: await updateEntry(
					client,
					info.githubId,
					info.address,
					info.sign,
					info.rewardId,
					info.contributionCount
			  )
	return result
}
