import requests
import datetime

API_KEY = 'da2-44mwmpanj5a5fjajolctbzmptq'
ENDPOINT = 'https://pqhsbdstnfbqvj5sughtrj7vay.appsync-api.us-east-1.amazonaws.com/graphql'


headers = {"X-Api-Key": API_KEY}


def run_query(query): # A simple function to use requests.post to make the API call. Note the json= section.
    request = requests.post(ENDPOINT, json={'query': query, 'variables': variables}, headers=headers)
    if request.status_code == 200:
        return request.json()
    else:
        raise Exception("Query failed to run by returning code of {}. {}".format(request.status_code, query))

        
# The GraphQL query (with a few aditional bits included) itself defined as a multi-line string.       
query = """
mutation createHistory($input:CreateHistoryInput!) {
    createHistory(
        input: $input
    ) {
        id
        user_id
        name
        visit_time
        live_photo_url
        resume_photo_url
        resume
    }
}
"""

variables = {
    'input':{
	'user_id': '123',
	'name': 'myname',
	'visit_time': str(datetime.datetime.now().strftime('%s')),
	'live_photo_url': 'https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png',
	#'live_photo_url': 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTVoh-YRIa57kVm1q6j7E2ROIUkekIwzyprEkFMB3YXCmvL_vHQBQ',
	#'resume_photo_url': 'http://icons.iconarchive.com/icons/graphicloads/100-flat/256/home-icon.png',
	'resume_photo_url': 'https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png',
	'resume': 'i am a genius' 
	}
}

result = run_query(query) # Execute the query
print(result)
