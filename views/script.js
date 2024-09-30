let token = '';
let currentPage = 1;
let showingSeenPosts = false;

$('#loginBtn').on('click', function() {
    const username = $('#username').val();
    if (!username) {
        alert('Please enter a username');
        return;
    }

    $.ajax({
            url: '/api/login',
            type: 'POST',
            contentType: 'application/json',
            data: JSON.stringify({
                username
            }),
        })
        .done(function(data) {
            token = data.token;
            $('#login').hide();
            $('#upload').show();
            $('#feed').show();
            loadFeed();
        })
        .fail(function() {
            alert('Login failed. Please try again.');
        });
});

$('#uploadBtn').on('click', function() {
    const fileInput = $('#fileInput')[0];
    if (fileInput.files.length === 0) {
        alert('Please select a photo to upload.');
        return;
    }

    const formData = new FormData();
    formData.append('photo', fileInput.files[0]);

    $.ajax({
        url: '/api/posts',
        type: 'POST',
        data: formData,
        contentType: false,
        processData: false,
        headers: {
            Authorization: `Bearer ${token}`
        },
        success: function() {
            alert('Photo uploaded successfully');
            $('#fileInput').val(''); // clear
            currentPage = 1;
            $('#posts').empty();
            loadFeed();
        },
        error: function() {
            alert('Error uploading photo. Please try again.');
        },
    });
});

let hasMore;

function loadFeed(page = 1) {
    $.ajax({
        url: `/api/posts?page=${page}`,
        method: 'GET',
        headers: {
            Authorization: `Bearer ${token}`,
        },
        success: function(response) {
            if (page === 1) {
                $('#posts').empty();
            }
            hasMore = response.hasMore;

            // Show unseen posts if available
            if (!response.seen) {
                $('#noPostsMessage').hide();
                if (!response.seen && !response.hasMore) {
                    $('#noPostsMessage').show();
                }
                if (response.posts && response.posts.length > 0) {
                    // Mark posts as viewed
                    const postIds = response.posts.map((post) => post.id);
                    markPostsAsViewed(postIds);

                    response.posts.forEach((post) => {
                        $('#posts').append(`
                            <div class="post">
                                <img src="${post.photoPath}" alt="Post Image" />
                                <p>Posted by: ${post.username}</p>
                            </div>
                             `);
                    });
                }
                if (response.hasMore) {
                    $('#loadMoreBtn').show();
                } else {
                    showingSeenPosts = true;

                    $('#loadMoreBtn').show();
                }
            } else {
                // showing seen posts
                if (!response.hasMore) {
                    $('#noPostsMessage').show();
                }
                if (response.posts && response.posts.length > 0) {
                    response.posts.forEach((post) => {
                        $('#posts').append(`
                            <div class="post">
                                <img src="${post.photoPath}" alt="Post Image" />
                                <p>Posted by: ${post.username}</p>
                            </div>
                        `);
                    });
                }
                if (!response.hasMore) {
                    $('#loadMoreBtn').hide();
                } else {
                    $('#loadMoreBtn').show();
                }
            }
        },
        error: function() {
            alert('Failed to load feed');
        },
    });
}

function markPostsAsViewed(postId) {
    $.ajax({
        url: '/api/posts/viewed',
        type: 'POST',
        contentType: 'application/json',
        headers: {
            Authorization: `Bearer ${token}`,
        },
        data: JSON.stringify({
            postId
        }),
        success: function() {
            console.log('Posts marked as viewed:', postId);
        },
        error: function() {
            console.error('Failed to mark posts as viewed');
        },
    });
}

$('#loadMoreBtn').on('click', function() {
    currentPage++;
    if (hasMore == false) {
        currentPage = 1;
    }

    loadFeed(currentPage);
});