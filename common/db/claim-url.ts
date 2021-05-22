import { UndefinedOr } from '@devprotocol/util-ts'
import { getDbClient, close } from './db'
import { claim_url } from '@prisma/client'

export const getClaimUrlRecordByGithubId = async function (
	githubId: string
): Promise<UndefinedOr<claim_url>> {
	const client = getDbClient()
	const tmp = await client.claim_url.findFirst({
		where: {
			github_id: githubId,
		},
	})
	const result = await close(client)
	const record = tmp === null || result === false ? undefined : tmp
	return record
}

export const getClaimUrlRecordByRewardId = async function (
	rewardId: number
): Promise<UndefinedOr<claim_url>> {
	const client = getDbClient()
	const tmp = await client.claim_url.findFirst({
		where: {
			AND: [
				{
					reward_id: rewardId,
					github_id: null,
					find_at: null,
				},
			],
		},
	})
	const result = await close(client)
	const record = tmp === null || result === false ? undefined : tmp
	return record
}

export const updateGitHubIdAndFindAt = async function (
	claimUrlId: number,
	githubId: string
): Promise<boolean> {
	const client = getDbClient()
	const afterData = await client.claim_url.update({
		where: { id: claimUrlId },
		data: { find_at: new Date(), github_id: githubId },
	})
	const result = await close(client)
	const isUpdated = afterData.find_at !== null && afterData.github_id !== null
	return result === false ? false : isUpdated
}