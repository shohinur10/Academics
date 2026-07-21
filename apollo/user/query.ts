import { gql } from '@apollo/client';

/**************************
 *         MEMBER         *
 *************************/

export const GET_AGENTS = gql`
query GetInstructors($input: InstructorsInquiry!) {
    getInstructors(input: $input) {
        list {
            _id
            memberType
            memberStatus
            memberAuthType
            memberPhone
            memberNick
            memberFullName
            memberImage
            memberAddress
            memberDesc
            memberProperties
            memberArticles
            memberFollowers
            memberFollowings
            memberPoints
            memberLikes
            memberViews
            memberComments
            memberRank
            memberBlocks
            memberWarnings
            deletedAt
            createdAt
            updatedAt
            accessToken
            meLiked {
                memberId
                likeRefId
                myFavorite
            }
            meFollowed {
                followingId
                followerId
                myFollowing
            }
        }
        metaCounter {
            total
        }
    }
}


`;

export const GET_MEMBER = gql(`
query GetMember($input: String!) {
    getMember(memberId: $input) {
        _id
        memberType
        memberStatus
        memberAuthType
        memberPhone
        memberNick
        memberFullName
        memberImage
        memberAddress
        memberDesc
        memberProperties
        memberArticles
        memberPoints
        memberLikes
        memberViews
        memberFollowings
				memberFollowers
        memberRank
        memberWarnings
        memberBlocks
        deletedAt
        createdAt
        updatedAt
        accessToken
        meFollowed {
					followingId
					followerId
					myFollowing
				}
    }
}
`);

/**************************
 *         COURSE         *
 * (GET_COURSES / GET_COURSE / GET_INSTRUCTORS defined below)
 *************************/

export const GET_INSTRUCTOR_COURSES = gql`
	query GetInstructorCourses($input: InstructorCoursesInquiry!) {
		getInstructorCourses(input: $input) {
			list {
				_id
				courseType
				courseStatus
				courseLevel
				courseCategory
				courseTitle
				courseDesc
				coursePrice
				courseDuration
				courseLessons
				courseStudents
				courseViews
				courseLikes
				courseImages
				memberId
				createdAt
				updatedAt
			}
			metaCounter {
				total
			}
		}
	}
`;

export const GET_FAVORITES = gql`
	query GetFavorites($input: OrdinaryInquiry!) {
		getFavorites(input: $input) {
			list {
				_id
				courseType
				courseStatus
				courseLevel
				courseCategory
				courseTitle
				courseDesc
				coursePrice
				courseDuration
				courseLessons
				courseStudents
				courseViews
				courseLikes
				courseComments
				courseRank
				courseImages
				memberId
				createdAt
				updatedAt
				memberData {
					_id
					memberType
					memberNick
					memberFullName
					memberImage
					memberDesc
					memberProperties
					memberRank
				}
				meLiked {
					memberId
					likeRefId
					myFavorite
				}

			}
			metaCounter {
				total
			}
		}
	}
`;


export const GET_VISITED = gql`
	query GetVisited($input: OrdinaryInquiry!) {
		getVisited(input: $input) {
			list {
				_id
				courseType
				courseStatus
				courseLevel
				courseCategory
				courseTitle
				courseDesc
				coursePrice
				courseDuration
				courseLessons
				courseStudents
				courseViews
				courseLikes
				courseComments
				courseRank
				courseImages
				memberId
				createdAt
				updatedAt
				memberData {
					_id
					memberType
					memberNick
					memberFullName
					memberImage
					memberDesc
					memberProperties
					memberRank
				}
				meLiked {
					memberId
					likeRefId
					myFavorite
				}

			}
			metaCounter {
				total
			}
		}
	}
`;


/**************************
 *      BOARD-ARTICLE     *
 *************************/

export const GET_BOARD_ARTICLE = gql`
query GetBoardArticle($input: String!) {
    getBoardArticle(articleId: $input) {
        _id
        articleCategory
        articleStatus
        articleTitle
        articleContent
        articleImage
        articleViews
        articleLikes
        articleComments
        memberId
        createdAt
        updatedAt
        memberData {
            _id
            memberType
            memberStatus
            memberAuthType
            memberPhone
            memberNick
            memberFullName
            memberImage
            memberAddress
            memberDesc
            memberProperties
            memberArticles
            memberFollowers
            memberFollowings
            memberPoints
            memberLikes
            memberViews
            memberComments
            memberRank
            memberBlocks
            memberWarnings
            deletedAt
            createdAt
            updatedAt
            accessToken
            meLiked {
                memberId
                likeRefId
                myFavorite
            }
            meFollowed {
                followingId
                followerId
                myFollowing
            }
        }
    }
}

`;

export const GET_BOARD_ARTICLES = gql`
	query GetBoardArticles($input: BoardArticlesInquiry!) {
    getBoardArticles(input: $input) {
        list {
            _id
            articleCategory
            articleStatus
            articleTitle
            articleContent
            articleImage
            articleViews
            articleLikes
            articleComments
            memberId
            createdAt
            updatedAt
            memberData {
                _id
                memberType
                memberStatus
                memberAuthType
                memberPhone
                memberNick
                memberFullName
                memberImage
                memberAddress
                memberDesc
                memberProperties
                memberArticles
                memberFollowers
                memberFollowings
                memberPoints
                memberLikes
                memberViews
                memberComments
                memberRank
                memberBlocks
                memberWarnings
                deletedAt
                createdAt
                updatedAt
                accessToken
                meLiked {
                    memberId
                    likeRefId
                    myFavorite
                }
                meFollowed {
                    followingId
                    followerId
                    myFollowing
                }
            }
        }
        metaCounter {
            total
        }
    }
}

`;

/**************************
 *         COMMENT        *
 *************************/

export const GET_COMMENTS = gql`
	query GetComments($input: CommentsInquiry!) {
		getComments(input: $input) {
			list {
				_id
				commentStatus
				commentGroup
				commentContent
				commentRefId
				memberId
				createdAt
				updatedAt
				memberData {
					_id
					memberType
					memberStatus
					memberAuthType
					memberPhone
					memberNick
					memberFullName
					memberImage
					memberAddress
					memberDesc
					memberWarnings
					memberBlocks
					memberProperties
					memberRank
					memberPoints
					memberLikes
					memberViews
					deletedAt
					createdAt
					updatedAt
					accessToken
				}
			}
			metaCounter {
				total
			}
		}
	}
`;

/**************************
 *         FOLLOW        *
 *************************/
export const GET_MEMBER_FOLLOWERS = gql`
	query GetMemberFollowers($input: FollowInquiry!) {
		getMemberFollowers(input: $input) {
			list {
				_id
				followingId
				followerId
				createdAt
				updatedAt
				meLiked {
					memberId
					likeRefId
					myFavorite
				}
				meFollowed {
					followingId
					followerId
					myFollowing
				}
				followerData {
					_id
					memberType
					memberStatus
					memberAuthType
					memberPhone
					memberNick
					memberFullName
					memberImage
					memberAddress
					memberDesc
					memberProperties
					memberArticles
					memberPoints
					memberLikes
					memberViews
					memberComments
					memberFollowings
					memberFollowers
					memberRank
					memberWarnings
					memberBlocks
					deletedAt
					createdAt
					updatedAt
				}
			}
			metaCounter {
				total
			}
		}
	}
`;

export const GET_MEMBER_FOLLOWINGS = gql`
	query GetMemberFollowings($input: FollowInquiry!) {
		getMemberFollowings(input: $input) {
			list {
				_id
				followingId
				followerId
				createdAt
				updatedAt
				followingData {
					_id
					memberType
					memberStatus
					memberAuthType
					memberPhone
					memberNick
					memberFullName
					memberImage
					memberAddress
					memberDesc
					memberProperties
					memberArticles
					memberPoints
					memberLikes
					memberViews
					memberComments
					memberFollowings
					memberFollowers
					memberRank
					memberWarnings
					memberBlocks
					deletedAt
					createdAt
					updatedAt
					accessToken
				}
				meLiked {
					memberId
					likeRefId
					myFavorite
				}
				meFollowed {
					followingId
					followerId
					myFollowing
				}
			}
			metaCounter {
				total
			}
		}
	}
`;

/**************************
 *         COURSE         *
 *************************/

export const GET_COURSES = gql`
	query GetCourses($input: CoursesInquiry!) {
		getCourses(input: $input) {
			list {
				_id
				courseType
				courseStatus
				courseLevel
				courseCategory
				courseSkill
				courseTitle
				courseDesc
				coursePrice
				courseDuration
				courseLessons
				courseStudents
				courseViews
				courseLikes
				courseComments
				courseRank
				courseImages
				memberId
				startedAt
				closedAt
				deletedAt
				createdAt
				updatedAt
				memberData {
					_id
					memberNick
					memberFullName
					memberImage
					memberType
					memberRank
				}
				meLiked {
					memberId
					likeRefId
					myFavorite
				}
			}
			metaCounter {
				total
			}
		}
	}
`;

export const GET_COURSE = gql`
	query GetCourse($input: String!) {
		getCourse(courseId: $input) {
			_id
			courseType
			courseStatus
			courseLevel
			courseCategory
			courseSkill
			courseTitle
			courseDesc
			coursePrice
			courseDuration
			courseLessons
			courseStudents
			courseViews
			courseLikes
			courseComments
			courseRank
			courseImages
			memberId
			startedAt
			closedAt
			createdAt
			updatedAt
			memberData {
				_id
				memberNick
				memberFullName
				memberImage
				memberType
				memberDesc
				memberRank
			}
			meLiked {
				memberId
				likeRefId
				myFavorite
			}
		}
	}
`;

export const GET_INSTRUCTORS = gql`
	query GetInstructors($input: InstructorsInquiry!) {
		getInstructors(input: $input) {
			list {
				_id
				memberType
				memberStatus
				memberNick
				memberFullName
				memberImage
				memberDesc
				memberProperties
				memberArticles
				memberFollowers
				memberFollowings
				memberPoints
				memberLikes
				memberViews
				memberComments
				memberRank
				createdAt
				updatedAt
				meLiked {
					memberId
					likeRefId
					myFavorite
				}
			}
			metaCounter {
				total
			}
		}
	}
`;
