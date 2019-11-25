import React, { Component} from 'react';
import axios from 'axios';
const validUrl = require("valid-url");


class URLShortener extends Component {
	constructor(props) {
		super(props)
		this.state = {
			inputUrl: '',
			showError: false,
			errorText: '',
			showShortLink: false,
			shortLinkText: '',
			analytics: {
				urlData: []
			},
			copyButtonText:''
		}
	}

	componentDidMount() {
		axios.get('http://localhost:8080/api/item/getAll')
			 .then(result=> {
			 	console.log(result.data.urls);
			 	 this.setState({
			 	 	analytics: {
			 	 		urlData: result.data.urls
			 	 	}
			 	 })
			 })
			 .catch(err=> {
			 	console.log(err);
			 	this.setState({
			 		inputUrl: '',
			 		showError: 'True',
			 		errorText: 'Some error occured',
			 		showShortLink: false,
			 		shortLinkText: ''
			 	}) 
			 })
	}

	handleShortenButtonClick() {
		const urlRegex =/^(http:\/\/www\.|https:\/\/www\.|http:\/\/|https:\/\/)?[a-z0-9]+([\-\.]{1}[a-z0-9]+)*\.[a-z]{2,5}(:[0-9]{1,5})?(\/.*)?$/;
		const inputUrl = this.state.inputUrl;
		if(inputUrl && urlRegex.test(inputUrl)) {
			axios.post("http://localhost:8080/api/item/create",{url:inputUrl})
				 .then( (result) => {
				 	console.log(result);
				 	this.setState({
				 		inputUrl: '',
				 		showError: false,
				 		showShortLink: true,
				 		shortLinkText: result.data.item.shortenedUrl,
				 		copyButtonText: 'Copy'
				 	})
				 	console.log(this.state);
				 })
				 .catch(err => {
				 	console.log(err);
				 	this.setState({
				 		inputUrl: '',
				 		showError: 'True',
				 		errorText: 'Invalid Url',
				 		showShortLink: false,
				 		shortLinkText: ''
				 	}) 
				 });
		} else if(!inputUrl) {
			this.setState({
		 		inputUrl: '',
		 		showError: 'True',
		 		errorText: 'Empty url',
		 		showShortLink: false,
		 		shortLinkText: ''
		 	})
		} else  {
			this.setState({
		 		inputUrl: '',
		 		showError: 'True',
		 		errorText: 'Invalid Url',
		 		showShortLink: false,
		 		shortLinkText: ''
		 	});
		}

	}

	copyToClipboard = (e) => {
		window.getSelection().removeAllRanges();
		var range = document.createRange();
		range.selectNode(this.shortLink);
		window.getSelection().addRange(range);
		document.execCommand("copy");
		window.getSelection().removeAllRanges();
		this.setState({
			copyButtonText: 'Copied'
		})
	};

	assembleAnalyticsSection() {
		let analytics = [], urlData = this.state.analytics.urlData;
		urlData.forEach(url => {
			console.log(url.originalUrl);
			analytics.push(<tr>
							  <td>{url.shortenedUrl}</td>
							  <td>{url.numberOfVisits}</td>
							  <td>{url.createdAt.substring(0,10)}</td>
							  <td>{url.lastHitAt.substring(0,10)}</td>
						   </tr>)
		})
		return analytics;
	}

	handleInputUrlChange(text) {
		this.setState({
			inputUrl: text 
		});
		console.log(this.state.inputUrl);
	}

	render() {
		let shortLink, error, analyticsSection;
		analyticsSection = this.assembleAnalyticsSection();
		if(this.state.showShortLink) {
			shortLink = <span style={{ display:'flex', flexDirection:'row'}}>
							<div style={{flexGrow:'4', marginTop:'20px'}}>Shortened Url : <span ref={(shortLink) => this.shortLink=shortLink} value={this.state.shortLinkText}>{this.state.shortLinkText}</span></div>
							<button style={{flexGrow:'1', height: '30px', marginTop:'20px'}} onClick={this.copyToClipboard}> {this.state.copyButtonText}</button>
						</span>
		}
		if(this.state.showError) {
			error = <small style={{ color: 'red'}}>{this.state.errorText}</small>
		}
		return(<div>
					<div>
						<div>
							<h3>Shortify</h3>
						</div>
						<div>
							<span >Type url: </span>
			                  <input 
			                     value={this.state.inputUrl}
			                     onChange={(event) => this.handleInputUrlChange(event.target.value)}
			                     type="text">
			                  </input>
			                  <button onClick={() => this.handleShortenButtonClick()} >Shorten</button>
						</div>
						<div>
							{shortLink}
						</div>
						<div>
							{error}
						</div>
					</div>
					<div>
						<div>
				            <h3>Analytics</h3>
				            <table cellPadding="10">
					            <thead>
					            	<tr>
					            		<th>Short Url</th>
					            		<th>No of Visits</th>
					            		<th>Created at</th>
					            		<th>Last Used at</th>
					            	</tr>
					            </thead>
					            <tbody>
				               		{analyticsSection}
				               	</tbody>
				            </table>
			            </div>
					</div>
				</div>)
}

 }

 export default URLShortener;