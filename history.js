
var History = React.createClass({
  render: function() {
    var rawMarkup = marked(this.props.children.toString(), {sanitize: true});
    return (
      <div className="history">
        <h2 className="historyAuthor">
          {this.props.author}
        </h2>
        <span dangerouslySetInnerHTML={{__html: rawMarkup}} />
      </div>
    );
  }
});

var HistoryBox = React.createClass({
  loadHistorysFromServer: function() {
    $.ajax({
      url: this.props.url,
      dataType: 'json',
      cache: false,
      success: function(data) {
        this.setState({data: data});
      }.bind(this),
      error: function(xhr, status, err) {
        console.error(this.props.url, status, err.toString());
      }.bind(this)
    });
  },
  getInitialState: function() {
    return {data: []};
  },
  componentDidMount: function() {
    this.loadHistorysFromServer();
    setInterval(this.loadHistorysFromServer, this.props.pollInterval);
  },
  render: function() {
    return (
      <div className="historyBox">
        <h1>Signup History</h1>
        <HistoryList data={this.state.data} />
      </div>
    );
  }
});

var HistoryList = React.createClass({
  render: function() {
    var historyNodes = this.props.data.map(function(history, index) {
      return (
        // `key` is a React-specific concept and is not mandatory for the
        // purpose of this tutorial. if you're curious, see more here:
        // http://facebook.github.io/react/docs/multiple-components.html#dynamic-children
        <History author={history.author} key={index}>
          {history.text}
        </History>
      );
    });
    return (
      <div className="historyList">
        {historyNodes}
      </div>
    );
  }
});

Parse.initialize("LzoGzGiknLdEUXmyB04WsMS3t564Xl9m9DhFIo6D", "lxPUR3V3ZNA72WqYSD0K8DgVxb6XWzCOvS5CiKcM");

React.render(
  <HistoryBox url="comments.json" pollInterval={10000} />,
  document.getElementById('content')
);
