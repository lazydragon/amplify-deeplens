import gql from 'graphql-tag';

export default gql`
query ListHistorys {
    listHistorys(limit: 1000) {
        items {
            id
            user_id
            name
            visit_time
            live_photo_url
            resume_photo_url
            resume
        }
    }
}`;