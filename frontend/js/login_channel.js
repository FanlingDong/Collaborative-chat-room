/**
 * the init status
 **/
window.currentPage = 'home';
/**
 * give different status to different pages
 **/
window.router = [
    {
        title: 'Dashboard',
        key: 'home',
        path: '#home',
    },
    {
        title: 'Register',
        key: 'register',
        path: '#register',
    },
    {
        title: 'Login',
        key: 'login',
        path: '#login',
    },
    {
        title: 'Channel',
        key: 'channel',
        path: '#channel',
    }
];

const homePageButton = document.getElementById('page-toggle-home');
const registerPageButton = document.getElementById('page-toggle-register');
const loginPageButton = document.getElementById('page-toggle-login');
const editChannelButton = document.getElementById('')
// const channelPageButton = document.getElementById('page-toggle-channel');

const homePage = document.getElementById('page-home');
const registerPage = document.getElementById('page-register');
const loginPage = document.getElementById('page-login');
const channelsPage = document.getElementById('page-channel');

/**
 * get users list
 * **/
function getUserList() {
    const jasonOptions = {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + localStorage.getItem('slackr_token'),
        },
        cache: 'no-cache',
    }
    fetch(`http://localhost:5005/user`, jasonOptions)
        .then((response) => response.json())
        .then(data => {
            if (data.error) {
                alert(`${data.error},error`);
                return;
            }
            console.log('successfully get the user list');
            // successfully get the users
            let {users} = data;
            window.SYSTEM_USERS = users;
        });
}

/**
 * the function getChannelsFirstStep used in goToChannelPage
 * fetch all of the channel data into the SYSTEM_CHANNELS
 */
function getChannelsFirstStep() {
    const jasonOptions = {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + localStorage.getItem('slackr_token'),
        },
    }
    fetch('http://localhost:5005/channel', jasonOptions)
        .then(response => response.json())
        .then(data => {
            if (data.error) {
                alert(`${data.error} can not get any channel info`);
                return;
            }
            alert('fetch channel successful！')
            window.SYSTEM_CHANNELS = data['channels'];
            const {channels} = data;
            addChannelsInPage(channels);
        })
}

/**
 * get the change of one page
 **/
window.onhashchange = function (event) {
    const {newUrl, oldUrl} = event;
    if (newUrl !== oldUrl) {
        console.log('进行了页面切换');
        getNowPage();
    }
}

/**
 * single-page part
 * **/
document.getElementById('page-toggle-home').addEventListener('click', () => {
    document.getElementById('page-toggle-register').style.display = 'block';
    document.getElementById('page-toggle-login').style.display = 'block';
    document.getElementById('page-home').style.display = 'block';
    document.getElementById('page-register').style.display = 'none';
    document.getElementById('page-login').style.display = 'none';
    document.getElementById('page-channel').style.display = 'none';
    location.hash = '#home';
});

document.getElementById('page-toggle-register').addEventListener('click', () => {
    location.hash = 'register';
    document.getElementById('page-home').style.display = 'none';
    document.getElementById('page-register').style.display = 'block';
    document.getElementById('page-login').style.display = 'none';
    document.getElementById('page-channel').style.display = 'none';
    document.getElementById('page-toggle-register').style.display = 'none';
    document.getElementById('page-toggle-login').style.display = 'none';
});

document.getElementById('page-toggle-login').addEventListener('click', () => {
    location.hash = 'login';
    document.getElementById('page-home').style.display = 'none';
    document.getElementById('page-register').style.display = 'none';
    document.getElementById('page-login').style.display = 'block';
    document.getElementById('page-channel').style.display = 'none';
    document.getElementById('page-toggle-register').style.display = 'none';
    document.getElementById('page-toggle-login').style.display = 'none';
});


/**
 * jump part
 * **/
function goToHomePage() {
    homePage.style.display = 'block';
    registerPage.style.display = 'none';
    loginPage.style.display = 'none';
    channelsPage.style.display = 'none';

    homePageButton.style.display = 'block';
    registerPageButton.style.display = 'block';
    loginPageButton.style.display = 'block';
}

function goToRegisterPage() {
    window.currentPage = 'register';
    homePage.style.display = 'none';
    registerPage.style.display = 'block';
    loginPage.style.display = 'none';
    channelsPage.style.display = 'none';

    homePageButton.style.display = 'block';
    registerPageButton.style.display = 'none';
    loginPageButton.style.display = 'none';
    location.hash = '#register';
}

function goToLoginPage() {
    window.currentPage = 'login';
    homePage.style.display = 'none';
    registerPage.style.display = 'none';
    loginPage.style.display = 'block';
    channelsPage.style.display = 'none';

    homePageButton.style.display = 'block';
    registerPageButton.style.display = 'none';
    loginPageButton.style.display = 'none';
    location.hash = 'login';
}

function goToChannelPage() {
    // control the show or hide pages
    homePage.style.display = 'none';
    registerPage.style.display = 'none';
    loginPage.style.display = 'none';
    channelsPage.style.display = 'block';

    homePageButton.style.display = 'none';
    registerPageButton.style.display = 'none';
    loginPageButton.style.display = 'none';
    // get user list
    getUserList();
    // get current log in user's information
    const userString = localStorage.getItem('slackr_user');
    const userOption = userString && JSON.parse(userString);
    const currentUserAllData = userOption;
    const currentHostUserName = document.getElementById('host_user');
    currentHostUserName.innerText = currentUserAllData.name;
    getChannelsFirstStep();
    location.hash = '#channel';
}

/**
 * confirm which page should be shown
 * **/
function getNowPage() {
    const hashPage = location.hash;
    switch (hashPage) {
        case '#register': {
            goToRegisterPage();
            break;
        }
        case '#login': {
            goToLoginPage();
            break;
        }
        case '#channel': {
            goToChannelPage();
            break;
        }
        default: {
            goToHomePage();
            break;
        }
    }
}

function init() {
    if (location.href.indexOf('?') === -1) {
        location.href = `${location.href}?`;
    }
    getNowPage();
}

window.onload = function () {
    // Initialize the project
    if (location.href.indexOf('?') === -1) {
        location.href = `${location.href}?`;
    }
    getNowPage();
}

/**
 * *****************************************************************************
 * *****************************************************************************
 * **/


/**
 * register-page
 * **/
document.getElementById('register_button').addEventListener('click', () => {
    const email = document.getElementById('register_email').value;
    const password = document.getElementById('register_password').value;
    const name = document.getElementById('register_name').value;
    const password_confirm = document.getElementById('register_password_confirmed').value;
    const data = {email, password, name,};
    console.log(email, password, name);

    if (password_confirm !== password) {
        alert('Passwords should be same!');
        return;
    }
    if (!name || !email || !password || !password_confirm) {
        alert('all of these info can not be null!');
        return;
    }

    const jasonString = JSON.stringify({
        email: email,
        password: password,
        name: name,
    });
    console.log(jasonString);

    const requestOptions = {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: jasonString,
    }

    fetch('http://localhost:5005/auth/register', requestOptions)
        .then((response) => {
            if (response.status === 400) {
                alert('please enter valid details!');
            } else if (response.status === 200) {
                console.log('all worked');
                response.json().then((data) => {
                    if (data.error) {
                        // login error
                        alert(`${data.error} ,error`);
                        return;
                    }
                    data.token && localStorage.setItem('slackr_token', data.token);
                    alert(`${email},  successful !`);
                    location.hash = 'login';
                    goToLoginPage();
                });
            }
        })
});
/**
 * login page
 * **/
document.getElementById('login_button').addEventListener('click', () => {
    const login_email = document.getElementById('login_email').value;
    const login_password = document.getElementById('login_password').value;
    const data = {email: login_email, login_password};
    const jasonString = JSON.stringify({
        email: login_email,
        password: login_password,
    });
    const requestOptions = {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: jasonString,
    };
    fetch('http://localhost:5005/auth/login', requestOptions).then((response) => {
        if (response.status === 400) {
            alert('please enter valid account and password! ' +
                'If you have no account, please register ahead!');
        } else if (response.status === 200) {
            console.log('all worked');
            response.json().then((data) => {
                data.token && localStorage.setItem('slackr_token', data.token);//data['token']
                console.log(data, '输出data');

                const userOption = {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': 'Bearer ' + localStorage.getItem('slackr_token'),
                    },
                }
                fetch(`http://localhost:5005/user/${data.userId}`, userOption)
                    .then((response) => response.json())
                    .then(user => {
                        if (user.name) {
                            user.userId = data.userId;
                            // then store the user ID in localStorage
                            const jasonStringUser = JSON.stringify(user);
                            localStorage.setItem('slackr_user', jasonStringUser);
                        }
                    })
                location.hash = 'channel';
                alert(`welcome ${login_email} !!!`);
                goToChannelPage();
            })
        }
    })
});

/**
 * logout function
 * **/
function resetStorage() {
    localStorage.removeItem('slackr_token');
    localStorage.removeItem('slackr_user');
    location.reload();
}

/**
 * logout function
 * **/
document.getElementById('logout-button').addEventListener('click', () => {
    const logoutOptions = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + localStorage.getItem('slackr_token'),
        },
    };
    console.log(localStorage.getItem('slackr_token'));
    fetch('http://localhost:5005/auth/logout', logoutOptions)
        .then(response => response.json())
        .then(data => {
            if (data.error) {
                alert('error');
                return;
            }
            location.reload();
            alert('logout success~');
            goToHomePage();
            location.hash = '#home';

        });
})

/**
 ***********************************************************************************
 ***********************************************************************************
 */

/**
 * close to add Channel (you won't loss any info)
 */
function closeAddChannelModal() {
    const closeAddChannelIcon = document.getElementById('closeAddChannelIcon');
    closeAddChannelIcon.click();
}

/**
 * cancel to Create Channel
 */
function cancelAddChannel() {
    const channelNameDom = document.getElementById('channelName');
    const channelDescriptionDom = document.getElementById('channelDescription');
    const channelPrivateDom = document.getElementById('channelPrivate');
    channelNameDom.value = '';
    channelDescriptionDom.value = '';
    channelPrivateDom.checked = false;
}

/**
 * click the create button and add the data in database
 */
function confirmAddChannel() {
    const channelName = document.getElementById('channelName').value;
    const channelDescription = document.getElementById('channelDescription').value;
    const channelPrivate = document.getElementById('channelPrivate').checked;

    if (!channelName) {
        alert('You should give the channel a name');
    }
    const jasonString = JSON.stringify({
        name: channelName,
        description: channelDescription || '',
        private: channelPrivate
    });
    const jasonOptions = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + localStorage.getItem('slackr_token'),
        },
        body: jasonString,
    }
    fetch('http://localhost:5005/channel', jasonOptions)
        .then((response) => response.json())
        .then(data => {
            if (data.error) {
                alert(`${data.error} error`);
                return;
            }
            alert('a new channel is created successfully');

            // get current channel Id
            const currentChannelId = data.channelId;
            // fetch the channel Id details from the data base
            const jason2Options = {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + localStorage.getItem('slackr_token'),
                    'channelId': currentChannelId,
                },
                cache: 'no-cache',
            }
            fetch(`http://localhost:5005/channel/${currentChannelId}`, jason2Options)
                .then((response) => response.json())
                .then(data => {
                    if (data.error) {
                        alert(`${data.error},error`);
                        return;
                    }
                    console.log(data);//the channelId's content
                    // add the new element in to channel list
                    const privateChannelListDon = document.getElementById('private_channel_list');
                    const publicChannelListDon = document.getElementById('public_channel_list');

                    const channelContainer_li = document.createElement('li');
                    const channelContainer_a = document.createElement('a');
                    channelContainer_a.id = currentChannelId;
                    channelContainer_a.className = 'channel link-dark rounded';
                    channelContainer_a.href = '#';
                    channelContainer_a.classList.add('active');
                    channelContainer_a.innerText = data.name;
                    channelContainer_li.appendChild(channelContainer_a);
                    const user = JSON.parse(localStorage.getItem('slackr_user'));

                    if (data.private === true) {
                        privateChannelListDon.appendChild(channelContainer_li);
                        channelContainer_li.appendChild(channelContainer_a);
                        setCurrentChannelHeader();
                        channelContainer_a.onclick = clickChannel;
                    } else if (data.private === false) {
                        publicChannelListDon.appendChild(channelContainer_li);
                        channelContainer_li.appendChild(channelContainer_a);
                        setCurrentChannelHeader();
                        channelContainer_a.onclick = clickChannel;
                    }
                });
            closeAddChannelModal();
        });
}

/**
 * click the button then edit current channel data detail
 */
function showEditChannel() {
    // get current channel Id
    const currentChannelId = document.querySelector('.channel.active');
    // fetch the channel Id details from the data base
    const jasonOptions = {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + localStorage.getItem('slackr_token'),
            'channelId': currentChannelId.id,
        },
        cache: 'no-cache',
    }
    fetch(`http://localhost:5005/channel/${currentChannelId.id}`, jasonOptions)
        .then((response) => response.json())
        .then(data => {
            if (data.error) {
                alert(`${data.error},error`);
                return;
            }
            console.log(data);
            const editChannelName = document.getElementById('editChannelName');
            const editChannelDescription = document.getElementById('editChannelDescription');
            editChannelName.value = data.name;
            editChannelDescription.value = data.description;
        });
}

/**
 * save edit moodle
 */
function saveEditChannel(){
    // get current channel Id
    const currentChannelId = document.querySelector('.channel.active');
    // save edit channel
    const newEditChannelName = document.getElementById('editChannelName').value;
    const newEditChannelDescription = document.getElementById('editChannelDescription').value;
    console.log('save channel',newEditChannelName,newEditChannelDescription);

    const putOptions = {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + localStorage.getItem('slackr_token'),
            'channelId': currentChannelId.id,
        },
        body: JSON.stringify({
            name: newEditChannelName,
            description: newEditChannelDescription,
        }),
    }

    fetch(`http://localhost:5005/channel/${currentChannelId.id}`, putOptions)
        .then((response) => response.json())
        .then(data => {
            console.log(data);
            alert('edit channel successfully');
            closeEditChannelModal();
            document.getElementById(currentChannelId.id).innerText = document.getElementById('editChannelName').value;
        });
}

/**
 * close to add Channel (you won't loss any info)
 */
function closeEditChannelModal() {
    const closeEditChannelIcon = document.getElementById('closeEditChannelIcon');
    closeEditChannelIcon.click();
}

/**
 * access the id to get channel data detail
 * @param {Number} channelId
 */
function getChannelById(channelId) {
    const jasonOptions = {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + localStorage.getItem('slackr_token'),
            'channelId': channelId,
        },
        cache: 'no-cache',
    }
    fetch(`http://localhost:5005/channel/${channelId}`, jasonOptions)
        .then((response) => response.json())
        .then(data => {
            if (data.error) {
                alert(`${data.error},error`);
                return;
            }
            return data;
        });
}

/**
 * set the current channel name into header
 *
 */
function setCurrentChannelHeader() {
    const activeNowChannel = document.querySelector('.channel.active');
    const currentChannelHeader = document.getElementById('current_channel_header');
    // append the channel name as the channel header
    currentChannelHeader.innerText = activeNowChannel.innerText;
}

/**
 * get current channel id (channelId)
 *
 */
function GetCurrentChannelId() {
    const activeNowChannel = document.querySelector('.channel.active');
    return activeNowChannel.id;
}

/**
 * put the active into current click channel
 *
 */
function clickChannel(event) {
    const targetId = event.target.id;
    const activeNowChannel = document.querySelector('.channel.active');
    // if you click the current channel, there will be no change
    if (activeNowChannel.id === targetId) return;
    // if now you click another channel
    else{
        activeNowChannel.classList.remove('active');
        event.target.classList.add('active');
        setCurrentChannelHeader();
    }
}

/**
 * append this channel into sidebar list
 *
 */
function addChannelsInPage(channels) {
    const privateChannelListDon = document.getElementById('private_channel_list');
    const publicChannelListDon = document.getElementById('public_channel_list');
    channels.forEach((channel, index) => {
        // create a new element in the
        const channelContainer_li = document.createElement('li');
        const channelContainer_a = document.createElement('a');
        // give the element id and class name
        channelContainer_a.id = channel.id;
        channelContainer_a.className = 'channel link-dark rounded';
        channelContainer_a.href = '#';
        channelContainer_a.classList.add('active');

        channelContainer_a.innerText = channel.name;
        channelContainer_li.appendChild(channelContainer_a);
        const user = JSON.parse(localStorage.getItem('slackr_user'));

        if (channel.private === true && channel.members.includes(user.userId)) {
            channelContainer_a.innerText = channel.name;
            privateChannelListDon.appendChild(channelContainer_li);
            channelContainer_li.appendChild(channelContainer_a);
            setCurrentChannelHeader();
            channelContainer_a.onclick = clickChannel;
        } else if (channel.private === false) {
            channelContainer_a.innerText = channel.name;
            publicChannelListDon.appendChild(channelContainer_li);
            channelContainer_li.appendChild(channelContainer_a);
            setCurrentChannelHeader();
            channelContainer_a.onclick = clickChannel;
        }

    });
}

