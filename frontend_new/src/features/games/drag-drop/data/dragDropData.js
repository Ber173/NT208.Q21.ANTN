/**
 * Drag & Drop game data — default content pool.
 * In production, fetched from GET /api/games/drag-drop/content
 */

const DRAG_DROP_DATA = {
  gameId: 'drag-drop-mixed-01',
  title: 'Match Words & Pictures',
  category: 'Mixed',
  difficulty: 'easy',
  rounds: [
    {
      roundId: 1,
      label: 'Fruits 🍉',
      pairs: [
        { id: 'apple', word: 'Apple', emoji: '🍎', pronunciation: '/ˈæp.əl/' },
        { id: 'banana', word: 'Banana', emoji: '🍌', pronunciation: '/bəˈnæn.ə/' },
        { id: 'grapes', word: 'Grapes', emoji: '🍇', pronunciation: '/ɡreɪps/' },
        { id: 'mango', word: 'Mango', emoji: '🥭', pronunciation: '/ˈmæŋ.ɡoʊ/' },
        { id: 'watermelon', word: 'Watermelon', emoji: '🍉', pronunciation: '/ˈwɔː.t̬ɚˌmel.ən/' },
        { id: 'strawberry', word: 'Strawberry', emoji: '🍓', pronunciation: '/ˈstrɔː.ber.i/' },
      ],
    },
    {
      roundId: 2,
      label: 'Animals 🐾',
      pairs: [
        { id: 'cat', word: 'Cat', emoji: '🐱', pronunciation: '/kæt/' },
        { id: 'dog', word: 'Dog', emoji: '🐶', pronunciation: '/dɔːɡ/' },
        { id: 'rabbit', word: 'Rabbit', emoji: '🐰', pronunciation: '/ˈræb.ɪt/' },
        { id: 'fish', word: 'Fish', emoji: '🐟', pronunciation: '/fɪʃ/' },
        { id: 'bird', word: 'Bird', emoji: '🐦', pronunciation: '/bɜːrd/' },
        { id: 'frog', word: 'Frog', emoji: '🐸', pronunciation: '/frɑːɡ/' },
      ],
    },
    {
      roundId: 3,
      label: 'Food 🍔',
      pairs: [
        { id: 'pizza', word: 'Pizza', emoji: '🍕', pronunciation: '/ˈpiː.t͡sə/' },
        { id: 'burger', word: 'Burger', emoji: '🍔', pronunciation: '/ˈbɜːr.ɡɚ/' },
        { id: 'icecream', word: 'Ice Cream', emoji: '🍦', pronunciation: '/ˈaɪs.kriːm/' },
        { id: 'cake', word: 'Cake', emoji: '🎂', pronunciation: '/keɪk/' },
        { id: 'rice', word: 'Rice', emoji: '🍚', pronunciation: '/raɪs/' },
        { id: 'bread', word: 'Bread', emoji: '🍞', pronunciation: '/bred/' },
      ],
    },
    {
      roundId: 4,
      label: 'Nature 🌿',
      pairs: [
        { id: 'sun', word: 'Sun', emoji: '☀️', pronunciation: '/sʌn/' },
        { id: 'moon', word: 'Moon', emoji: '🌙', pronunciation: '/muːn/' },
        { id: 'star', word: 'Star', emoji: '⭐', pronunciation: '/stɑːr/' },
        { id: 'tree', word: 'Tree', emoji: '🌳', pronunciation: '/triː/' },
        { id: 'flower', word: 'Flower', emoji: '🌸', pronunciation: '/ˈflaʊ.ɚ/' },
        { id: 'rain', word: 'Rain', emoji: '🌧️', pronunciation: '/reɪn/' },
      ],
    },
  ],
};

export default DRAG_DROP_DATA;
