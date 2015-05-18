Parse.initialize("LzoGzGiknLdEUXmyB04WsMS3t564Xl9m9DhFIo6D", "lxPUR3V3ZNA72WqYSD0K8DgVxb6XWzCOvS5CiKcM");

var History = React.createClass({
  mixins: [ParseReact.Mixin], // Enable query subscriptions

  observe: function(props, state) {
    // Subscribe to all Comment objects, ordered by creation date
    // The results will be available at this.data.comments
    return {
      comments: (new Parse.Query('Signup')).equalTo("name", "Brian Wolfe")
    };
  },

  render: function() {
    // Render the text of each signup as a list item
    return (
      <ul>
        {this.data.comments.map(function(c) {
          return <li>{c.name} held the job of {c.job_title} ({c.point_value}) for the event on {c.event}.</li>;
        })}
      </ul>
    );
  }
});

React.render(<History/>, document.getElementById("content"));