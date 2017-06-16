$(function(){

  // Based on http://blog.teamtreehouse.com/code-a-simple-github-api-webapp-using-jquery-ajax

  // Modify this with correct repo data when project is on Github
  var owner = 'apadana-translation';
  var repo = 'apadanapali';
  var file = 'section-3/poem-1.md';
  var fileuri  = 'https://api.github.com/repos/'+owner+'/'+repo+'/commits?path='+file;

  requestJSON(fileuri, function(json) {
    if(json.message == "Not Found" || fileuri == '') {
      $('#version-history').html("<li>No commit history found</li></ul></section>");
    }

    else {
      var outhtml = '';

      var commits;
      $.getJSON(fileuri, function(json){
        commits = json;
        outputPageContent();
      });

      function outputPageContent() {
        if(commits.length == 0) { outhtml = outhtml + '<li>No commit history found</li></ul></section>'; }
        else {
          $.each(commits, function(index) {
            var dateString = commits[index].commit.author.date;
            var date = moment(dateString).format("MMMM Do, YYYY");
            // Don't show url on latest commit
            if (index == commits.length - 1) {
              outhtml = outhtml + '<li><div class="timeline__marker"></div><time datetime="'+date+'" class="timeline__date">'+date+'</time></li>';
            } else {
              outhtml = outhtml + '<li><div class="timeline__marker"></div><a href="'+commits[index].html_url+'/'+file+'" target="_blank"><time datetime="'+date+'" class="timeline__date">'+date+'</time></a></li>';
            }
          });
          outhtml = outhtml + '</ul></section>';
        }
        $('#version-history').html(outhtml);
      } // end outputPageContent()
    } // end else statement
  }); // end requestJSON Ajax call

  function requestJSON(url, callback) {
    $.ajax({
      url: url,
      // Modify or remove request?
      beforeSend: function(request) {
		    request.setRequestHeader("User-Agent","dnjohnson84");
      },
      complete: function(xhr) {
        callback.call(null, xhr.responseJSON);
      }
    });
  }
});
