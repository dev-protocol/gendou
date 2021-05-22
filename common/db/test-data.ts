/* eslint-disable functional/no-expression-statement */
/* eslint-disable functional/functional-parameters */
import { getDbClient, close } from './db'

export const createRewardTestData = async function (): Promise<void> {
	const prisma = getDbClient()
	await prisma.reward.deleteMany()
	await prisma.reward.create({
		data: {
			id: 1,
			commit_lower_limit: 500,
			commit_upper_limit: 2000,
			reward: '10000000000000000000',
			rank: 0,
		},
	})
	await prisma.reward.create({
		data: {
			id: 2,
			commit_lower_limit: 2001,
			commit_upper_limit: 5000,
			reward: '40000000000000000000',
			rank: 1,
		},
	})
	await prisma.reward.create({
		data: {
			id: 3,
			commit_lower_limit: 5001,
			commit_upper_limit: 2147483647,
			reward: '40000000000000000000',
			rank: 2,
		},
	})
	await close(prisma)
}

export const createClaimUrlTestData = async function (): Promise<void> {
	const prisma = getDbClient()
	await prisma.claim_url.deleteMany()
	await prisma.claim_url.create({
		data: {
			uuid: 'xxxxxxxx-xxxx-Mxxx-Nxxx-xxxxxxxxxxxx',
			claim_url: 'http://hogehoge/hurahura1',
			reward_id: 1,
			github_id: 'github-id1',
			find_at: new Date(),
		},
	})
	await prisma.claim_url.create({
		data: {
			uuid: 'yyyyyyyy-xxxx-Mxxx-Nxxx-xxxxxxxxxxxx',
			claim_url: 'http://hogehoge/hurahura2',
			reward_id: 1,
			github_id: null,
			find_at: null,
		},
	})
	await prisma.claim_url.create({
		data: {
			uuid: 'zzzzzzzz-xxxx-Mxxx-Nxxx-xxxxxxxxxxxx',
			claim_url: 'http://hogehoge/hurahura3',
			reward_id: 2,
			github_id: 'github-id2',
			find_at: new Date(),
		},
	})
	await prisma.claim_url.create({
		data: {
			uuid: 'aaaaaaaaa-xxxx-Mxxx-Nxxx-xxxxxxxxxxxx',
			claim_url: 'http://hogehoge/hurahura4',
			reward_id: 3,
			github_id: null,
			find_at: null,
		},
	})
	await close(prisma)
}