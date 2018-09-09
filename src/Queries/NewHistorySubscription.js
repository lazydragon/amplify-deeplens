import gql from 'graphql-tag';

export default gql`
subscription onCreateHistory {
    onCreateHistory {
        id
        user_id
        name
        visit_time
        live_photo_url
        resume_photo_url
        resume
    }
}`;