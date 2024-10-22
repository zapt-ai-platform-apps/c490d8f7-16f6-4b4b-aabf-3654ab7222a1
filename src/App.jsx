import { createSignal, onMount, createEffect, For, Show } from 'solid-js';
import { createEvent, supabase } from './supabaseClient';
import { Auth } from '@supabase/auth-ui-solid';
import { ThemeSupa } from '@supabase/auth-ui-shared';

function App() {
  const [user, setUser] = createSignal(null);
  const [currentPage, setCurrentPage] = createSignal('login');
  const [facts, setFacts] = createSignal([]);
  const [newFact, setNewFact] = createSignal('');
  const [loading, setLoading] = createSignal(false);

  const checkUserSignedIn = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      setUser(user);
      setCurrentPage('homePage');
    }
  };

  onMount(checkUserSignedIn);

  createEffect(() => {
    const { data: authListener } = supabase.auth.onAuthStateChange((_, session) => {
      if (session?.user) {
        setUser(session.user);
        setCurrentPage('homePage');
      } else {
        setUser(null);
        setCurrentPage('login');
      }
    });

    return () => {
      authListener.unsubscribe();
    };
  });

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setCurrentPage('login');
  };

  const fetchFacts = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) return;
    try {
      const response = await fetch('/api/getFacts', {
        headers: {
          'Authorization': `Bearer ${session.access_token}`
        }
      });
      if (response.ok) {
        const data = await response.json();
        setFacts(data);
      } else {
        console.error('Error fetching facts:', response.statusText);
      }
    } catch (error) {
      console.error('Error fetching facts:', error);
    }
  };

  const saveFact = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) return;
    try {
      const response = await fetch('/api/saveFact', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${session.access_token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ factText: newFact() }),
      });
      if (response.ok) {
        const savedFact = await response.json();
        setFacts([...facts(), savedFact]);
        setNewFact('');
      } else {
        console.error('Error saving fact');
      }
    } catch (error) {
      console.error('Error saving fact:', error);
    }
  };

  const handleGenerateFact = async () => {
    setLoading(true);
    try {
      const result = await createEvent('chatgpt_request', {
        prompt: 'Provide an interesting fact about the Earth.',
        response_type: 'text',
      });
      setNewFact(result);
    } catch (error) {
      console.error('Error generating fact:', error);
    } finally {
      setLoading(false);
    }
  };

  createEffect(() => {
    if (user()) {
      fetchFacts();
    }
  });

  return (
    <div class="min-h-screen bg-gradient-to-br from-green-100 to-blue-100 p-4">
      <Show
        when={currentPage() === 'homePage'}
        fallback={
          <div class="flex items-center justify-center h-full">
            <div class="w-full max-w-md p-8 bg-white rounded-xl shadow-lg">
              <h2 class="text-3xl font-bold mb-6 text-center text-green-600">Sign in with ZAPT</h2>
              <a
                href="https://www.zapt.ai"
                target="_blank"
                rel="noopener noreferrer"
                class="text-blue-500 hover:underline mb-6 block text-center"
              >
                Learn more about ZAPT
              </a>
              <Auth
                supabaseClient={supabase}
                appearance={{ theme: ThemeSupa }}
                providers={['google', 'facebook', 'apple']}
                magicLink={true}
                view="magic_link"
                showLinks={false}
                authView="magic_link"
              />
            </div>
          </div>
        }
      >
        <div class="max-w-4xl mx-auto">
          <div class="flex justify-between items-center mb-8">
            <h1 class="text-4xl font-bold text-green-600">Earth Facts</h1>
            <button
              class="bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-6 rounded-full shadow-md focus:outline-none focus:ring-2 focus:ring-red-400 transition duration-300 ease-in-out transform hover:scale-105 cursor-pointer"
              onClick={handleSignOut}
            >
              Sign Out
            </button>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div class="col-span-1">
              <h2 class="text-2xl font-bold mb-4 text-green-600">Generate New Fact</h2>
              <div class="space-y-4">
                <textarea
                  placeholder="Your new Earth fact will appear here..."
                  value={newFact()}
                  onInput={(e) => setNewFact(e.target.value)}
                  class="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-400 focus:border-transparent box-border"
                  rows="5"
                  readOnly
                />
                <div class="flex space-x-4">
                  <button
                    onClick={handleGenerateFact}
                    class={`flex-1 px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition duration-300 ease-in-out transform hover:scale-105 cursor-pointer ${loading() ? 'opacity-50 cursor-not-allowed' : ''}`}
                    disabled={loading()}
                  >
                    <Show when={loading()}>
                      Generating...
                    </Show>
                    <Show when={!loading()}>
                      Generate Fact
                    </Show>
                  </button>
                  <button
                    onClick={saveFact}
                    class="flex-1 px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition duration-300 ease-in-out transform hover:scale-105 cursor-pointer"
                    disabled={!newFact()}
                  >
                    Save Fact
                  </button>
                </div>
              </div>
            </div>

            <div class="col-span-1">
              <h2 class="text-2xl font-bold mb-4 text-green-600">Your Saved Facts</h2>
              <div class="space-y-4 max-h-[calc(100vh-300px)] overflow-y-auto pr-4">
                <For each={facts()}>
                  {(fact) => (
                    <div class="bg-white p-6 rounded-lg shadow-md transition duration-300 ease-in-out transform hover:scale-105">
                      <p class="text-gray-700">{fact.factText}</p>
                      <p class="text-gray-500 text-sm mt-2">Saved on: {new Date(fact.createdAt).toLocaleString()}</p>
                    </div>
                  )}
                </For>
              </div>
            </div>
          </div>
        </div>
      </Show>
    </div>
  );
}

export default App;