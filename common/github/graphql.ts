import { graphql } from '@octokit/graphql'
import { getSearchDate } from '../utils'

const COMMIT_COUNT_QUERY = `
query getCommitCount($githubid: String!, $from: DateTime, $to: DateTime) {
  user(login: $githubid) {
    contributionsCollection(from: $from, to: $to) {
	  contributionCalendar {
	    totalContributions
	  }
	}
  }
}
`

const getCommitCountFromGraphQL = async function (
	githubId: string,
	from: Date,
	to: Date
): Promise<number> {
	const graphqlWithAuth = graphql.defaults({
		headers: {
			authorization: `token ${process.env.GITHUB_API_TOKEN}`,
		},
	})
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	const result: any = await graphqlWithAuth(COMMIT_COUNT_QUERY, {
		githubid: githubId,
		from: from,
		to: to,
	})
	return Number(
		result.user.contributionsCollection.contributionCalendar.totalContributions
	)
}

export const getCommitCount = async function (
	githubId: string
): Promise<number> {
	// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
	const searchDate = getSearchDate(process.env.BASE_DATE!)
	const commitCount = await getCommitCountFromGraphQL(
		githubId,
		searchDate.from,
		searchDate.to
	)
	return commitCount
}

const COMMIT_COUNT_AND_ID_QUERY = `
query getUser($from: DateTime, $to: DateTime) {
	viewer {
    login
	contributionsCollection(from: $from, to: $to) {
	  contributionCalendar {
	    totalContributions
	  }
	}
  }
}
`

const getCommitCountAndIdFromGraphQL = async function (
	token: string,
	from: Date,
	to: Date
): Promise<GithubIdAndCommitCount> {
	const graphqlWithAuth = graphql.defaults({
		headers: {
			authorization: `token ${token}`,
		},
	})
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	const result: any = await graphqlWithAuth(COMMIT_COUNT_AND_ID_QUERY, {
		from: from,
		to: to,
	})
	return {
		githubId: result.viewer.login,
		commitCount:
			result.viewer.contributionsCollection.contributionCalendar
				.totalContributions,
	}
}

export const getCommitCountAndId = async function (
	token: string
): Promise<GithubIdAndCommitCount> {
	// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
	const searchDate = getSearchDate(process.env.BASE_DATE!)
	const result = await getCommitCountAndIdFromGraphQL(
		token,
		searchDate.from,
		searchDate.to
	)
	return result
}