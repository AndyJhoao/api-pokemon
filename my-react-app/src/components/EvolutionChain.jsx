import { useState, useEffect } from 'react';
import { apiUrl } from '../config/api';

const TYPE_COLORS = {
  normal: '#A8A77A', fire: '#EE8130', water: '#6390F0', electric: '#F7D02C',
  grass: '#7AC74C', ice: '#96D9D6', fighting: '#C22E28', poison: '#A33EA1',
  ground: '#E2BF65', flying: '#A98FF3', psychic: '#F95587', bug: '#A6B91A',
  rock: '#B6A136', ghost: '#735797', dragon: '#6F35FC', dark: '#705746',
  steel: '#B7B7CE', fairy: '#D685AD',
};

const ITEM_SPRITE_URL = 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/';
const TYPE_ICON_URL = 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/types/generation-ix/scarlet-violet/';
const TYPE_IDS = {
  normal: 1, fighting: 2, flying: 3, poison: 4, ground: 5, rock: 6,
  bug: 7, ghost: 8, steel: 9, fire: 10, water: 11, grass: 12,
  electric: 13, psychic: 14, ice: 15, dragon: 16, dark: 17, fairy: 18,
};

// --- Utility functions ---
function extractItemName(condition) {
  if (!condition) return null;
  const useMatch = condition.match(/use\s+([\w-]+)/);
  if (useMatch) return useMatch[1];
  const holdMatch = condition.match(/holding\s+([\w-]+)/);
  if (holdMatch) return holdMatch[1];
  return null;
}

function hasHappiness(condition) {
  return condition && /happiness/i.test(condition);
}

function isTradeEvo(condition) {
  return condition && /^trade/i.test(condition);
}

function formatItemLabel(name) {
  return name.replace(/-/g, ' ');
}

// Collect all names from tree
function collectNames(node) {
  if (!node) return [];
  const names = [node.name];
  if (node.evolvesTo) {
    node.evolvesTo.forEach(child => names.push(...collectNames(child)));
  }
  return names;
}

// Flatten tree into linear path (only works for linear chains)
function flattenLinear(node) {
  const result = [];
  let current = node;
  while (current) {
    result.push(current);
    current = current.evolvesTo && current.evolvesTo.length === 1 ? current.evolvesTo[0] : null;
  }
  return result;
}

// Determine layout type from tree
function getLayoutType(tree) {
  if (!tree || !tree.evolvesTo || tree.evolvesTo.length === 0) return 'single';

  // Check if any node has multiple branches
  let node = tree;
  while (node) {
    if (node.evolvesTo && node.evolvesTo.length > 2) return 'circular'; // 3+ branches = circular (eevee)
    if (node.evolvesTo && node.evolvesTo.length === 2) return 'fork';   // 2 branches = fork (<)
    node = node.evolvesTo && node.evolvesTo.length === 1 ? node.evolvesTo[0] : null;
  }
  return 'linear';
}

// --- SVG Icons ---
function HappinessIcon() {
  return (
    <svg className="w-7 h-7" viewBox="0 0 24 24" fill="none">
      <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" fill="#f472b6" />
      <circle cx="18" cy="4" r="1.2" fill="#fbbf24" opacity="0.9" />
      <circle cx="20.5" cy="6" r="0.7" fill="#fbbf24" opacity="0.7" />
      <circle cx="4" cy="5.5" r="0.8" fill="#fbbf24" opacity="0.8" />
    </svg>
  );
}

function TradeIcon() {
  return (
    <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 21L3 16.5m0 0L7.5 12M3 16.5h13.5m0-13.5L21 7.5m0 0L16.5 12M21 7.5H7.5" className="text-sky-400" />
    </svg>
  );
}

// --- Condition icon (item/happiness/trade) ---
function ConditionIcon({ condition }) {
  const itemName = extractItemName(condition);
  const happy = hasHappiness(condition);
  const trade = isTradeEvo(condition);

  if (itemName) {
    return (
      <div className="group relative cursor-default">
        <img
          src={`${ITEM_SPRITE_URL}${itemName}.png`}
          alt={itemName}
          className="w-8 h-8 object-contain drop-shadow-md"
          onError={(e) => { e.target.style.display = 'none'; }}
        />
        <span className="pointer-events-none absolute -top-7 left-1/2 -translate-x-1/2 bg-gray-900 text-white text-[10px] px-2 py-1 rounded shadow-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-20 capitalize">
          {formatItemLabel(itemName)}
        </span>
      </div>
    );
  }
  if (happy) {
    return (
      <div className="group relative cursor-default">
        <HappinessIcon />
        <span className="pointer-events-none absolute -top-7 left-1/2 -translate-x-1/2 bg-gray-900 text-white text-[10px] px-2 py-1 rounded shadow-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-20">
          Friendship evolution
        </span>
      </div>
    );
  }
  if (trade) {
    return (
      <div className="group relative cursor-default">
        <TradeIcon />
        <span className="pointer-events-none absolute -top-7 left-1/2 -translate-x-1/2 bg-gray-900 text-white text-[10px] px-2 py-1 rounded shadow-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-20">
          Trade evolution
        </span>
      </div>
    );
  }
  return null;
}

// --- Chain connector (horizontal arrow + condition) ---
function ChainLink({ condition }) {
  return (
    <div className="flex flex-col items-center justify-center mx-6 shrink-0">
      <ConditionIcon condition={condition} />
      <svg className="w-6 h-6 text-gray-400 dark:text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
      </svg>
    </div>
  );
}

// --- Loading spinner for cards ---
function CardSpinner() {
  return (
    <svg className="animate-spin h-8 w-8 text-amber-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
    </svg>
  );
}

// --- Locked card ---
function LockedCard({ onClick, isLoading }) {
  return (
    <button
      onClick={onClick}
      disabled={isLoading}
      className="evo-locked group relative w-40 h-52 rounded-xl bg-gray-200/80 dark:bg-white/5 border-2 border-dashed border-gray-300 dark:border-white/20 backdrop-blur-sm cursor-pointer transition-all hover:scale-105 hover:border-amber-400 dark:hover:border-amber-400 overflow-hidden disabled:cursor-wait disabled:hover:scale-100"
    >
      <div className="absolute inset-0 evo-sparkle" />
      <div className="absolute inset-0 flex items-center justify-center">
        {isLoading ? (
          <CardSpinner />
        ) : (
          <span className="text-4xl opacity-60 group-hover:opacity-100 transition-opacity">?</span>
        )}
      </div>
      <div className="absolute bottom-1 left-0 right-0 text-center">
        <span className="text-[9px] text-gray-400 dark:text-gray-500">
          {isLoading ? 'Discovering...' : 'Click to reveal'}
        </span>
      </div>
    </button>
  );
}

// --- Revealed card ---
function RevealedCard({ name, sprite, types, isCurrent, isLoading }) {
  return (
    <div className={`evo-reveal relative w-40 rounded-xl p-3 text-center transition-all ${
      isCurrent
        ? 'bg-amber-50/90 dark:bg-amber-500/10 border-2 border-amber-400 shadow-lg shadow-amber-400/20'
        : 'bg-white/80 dark:bg-white/5 border border-gray-200 dark:border-white/10'
    }`}>
      {isCurrent && (
        <div className="absolute -top-2 left-1/2 -translate-x-1/2 bg-amber-400 text-black text-[8px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
          Current
        </div>
      )}
      <div className="relative mx-auto w-24 h-24 mb-2 flex items-center justify-center">
        {isLoading && !sprite ? (
          <CardSpinner />
        ) : sprite ? (
          <img src={sprite} alt={name} className="w-full h-full object-contain drop-shadow-md" />
        ) : (
          <div className="w-full h-full bg-gray-200 dark:bg-gray-700 rounded-full flex items-center justify-center text-lg">?</div>
        )}
      </div>
      <p className="text-xs font-bold text-gray-900 dark:text-white capitalize truncate">{name}</p>
      {types && (
        <div className="flex justify-center gap-1 mt-1 flex-wrap">
          {types.map(t => {
            const key = t.toLowerCase();
            const typeId = TYPE_IDS[key];
            return (
              <span key={t} className="group/type relative cursor-default">
                {typeId ? (
                  <img
                    src={`${TYPE_ICON_URL}${typeId}.png`}
                    alt={t}
                    className="w-20 object-contain"
                    onError={(e) => { e.target.style.display = 'none'; if (e.target.nextSibling) e.target.nextSibling.style.display = 'inline-block'; }}
                  />
                ) : null}
                <span className="w-2 h-2 rounded-full inline-block" style={{ backgroundColor: TYPE_COLORS[key] || '#777', display: typeId ? 'none' : 'inline-block' }} />
                <span className="pointer-events-none absolute -top-6 left-1/2 -translate-x-1/2 bg-gray-900 text-white text-[9px] px-1.5 py-0.5 rounded shadow-lg opacity-0 group-hover/type:opacity-100 transition-opacity whitespace-nowrap z-20 capitalize">
                  {t}
                </span>
              </span>
            );
          })}
        </div>
      )}
    </div>
  );
}

// --- EvoCard: wrapper that handles locked/revealed state ---
function EvoCard({ node, isCurrent, currentSprite, currentTypes, revealed, onReveal, evoData, autoDiscover, loadingNames }) {
  const isRevealed = autoDiscover || revealed[node.name];
  const data = evoData[node.name];
  const isLoading = loadingNames?.has(node.name);

  if (isRevealed) {
    return (
      <RevealedCard
        name={node.name}
        sprite={isCurrent ? currentSprite : data?.sprite}
        types={isCurrent ? currentTypes : data?.types}
        isCurrent={isCurrent}
        isLoading={isLoading && !isCurrent}
      />
    );
  }
  return <LockedCard onClick={() => onReveal(node.name)} isLoading={isLoading} />;
}

// ============================================================
// LAYOUT: LINEAR (charmander → charmeleon → charizard)
// ============================================================
function LinearLayout({ tree, currentPokemonName, currentSprite, currentTypes, revealed, onReveal, evoData, autoDiscover, loadingNames }) {
  const nodes = flattenLinear(tree);
  return (
    <div className="flex items-center justify-center gap-x-4">
      {nodes.map((node, i) => {
        const isCurrent = node.name === currentPokemonName;
        return (
          <div key={node.name} className="flex items-center">
            {i > 0 && <ChainLink condition={node.condition} />}
            <EvoCard
              node={node} isCurrent={isCurrent}
              currentSprite={currentSprite} currentTypes={currentTypes}
              revealed={revealed} onReveal={onReveal} evoData={evoData} autoDiscover={autoDiscover} loadingNames={loadingNames}
            />
          </div>
        );
      })}
    </div>
  );
}

// ============================================================
// LAYOUT: FORK — base < (branch1 top, branch2 bottom)
// Walks linear until the fork, then splits into 2 diagonal branches
// ============================================================
function ForkLayout({ tree, currentPokemonName, currentSprite, currentTypes, revealed, onReveal, evoData, autoDiscover, loadingNames }) {
  // Walk to the fork point
  const linearPart = [];
  let forkNode = tree;
  while (forkNode && forkNode.evolvesTo && forkNode.evolvesTo.length === 1) {
    linearPart.push(forkNode);
    forkNode = forkNode.evolvesTo[0];
  }
  // forkNode is the one with 2 branches (or the root if root has 2)
  linearPart.push(forkNode);
  const branches = forkNode.evolvesTo || [];

  const cardProps = { currentPokemonName, currentSprite, currentTypes, revealed, onReveal, evoData, autoDiscover, loadingNames };

  return (
    <div className="flex items-center justify-center gap-x-4">
      {/* Linear portion */}
      {linearPart.map((node, i) => {
        const isCurrent = node.name === currentPokemonName;
        return (
          <div key={node.name} className="flex items-center">
            {i > 0 && <ChainLink condition={node.condition} />}
            <EvoCard node={node} isCurrent={isCurrent} {...cardProps} />
          </div>
        );
      })}

      {/* Fork: 2 branches in diagonal */}
      {branches.length === 2 && (
        <div className="flex flex-col gap-2 ml-1">
          {branches.map((branch, bi) => (
            <div key={branch.name} className="flex items-center">
              <ChainLink condition={branch.condition} />
              <EvoCard node={branch} isCurrent={branch.name === currentPokemonName} {...cardProps} />
              {/* If branch has further evolutions, render them inline */}
              {branch.evolvesTo && branch.evolvesTo.map(sub => (
                <div key={sub.name} className="flex items-center">
                  <ChainLink condition={sub.condition} />
                  <EvoCard node={sub} isCurrent={sub.name === currentPokemonName} {...cardProps} />
                </div>
              ))}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ============================================================
// LAYOUT: CIRCULAR — center pokemon surrounded by evolutions (eevee)
// Walks linear until the node with 3+ branches, then renders circular
// ============================================================
function CircularLayout({ tree, currentPokemonName, currentSprite, currentTypes, revealed, onReveal, evoData, autoDiscover, loadingNames }) {
  // Walk linear portion until we find the node with 3+ branches
  const linearPart = [];
  let circleNode = tree;
  while (circleNode && circleNode.evolvesTo && circleNode.evolvesTo.length === 1) {
    linearPart.push(circleNode);
    circleNode = circleNode.evolvesTo[0];
  }
  // circleNode has 3+ branches
  const branches = circleNode.evolvesTo || [];
  const cardProps = { currentPokemonName, currentSprite, currentTypes, revealed, onReveal, evoData, autoDiscover, loadingNames };

  // Circle geometry
  const count = branches.length;
  const radius = count <= 4 ? 240 : count <= 6 ? 300 : 380;
  const centerSize = 180; // px for center area

  return (
    <div className="flex flex-col items-center gap-4">
      {/* Linear part before the circle (e.g., for chains where evolution starts after stage 1) */}
      {linearPart.length > 0 && (
        <div className="flex items-center justify-center gap-x-4 mb-2">
          {linearPart.map((node, i) => {
            const isCurrent = node.name === currentPokemonName;
            return (
              <div key={node.name} className="flex items-center">
                {i > 0 && <ChainLink condition={node.condition} />}
                <EvoCard node={node} isCurrent={isCurrent} {...cardProps} />
              </div>
            );
          })}
        </div>
      )}

      {/* Circular arrangement */}
      <div className="relative" style={{ width: (radius * 2) + centerSize, height: (radius * 2) + centerSize, isolation: 'isolate' }}>
        {/* SVG lines from center to each branch (behind cards) */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ zIndex: 0 }}>
          {branches.map((branch, i) => {
            const angle = (2 * Math.PI * i / count) - Math.PI / 2;
            const cx = (radius * 2 + centerSize) / 2;
            const cy = (radius * 2 + centerSize) / 2;
            const lineLength = (radius - 50) * 0.8;
            const ex = cx + Math.cos(angle) * lineLength;
            const ey = cy + Math.sin(angle) * lineLength;
            return (
              <line
                key={i}
                x1={cx} y1={cy} x2={ex} y2={ey}
                stroke="rgba(156, 163, 175, 0.4)"
                strokeWidth="2"
                strokeDasharray="6 4"
              />
            );
          })}
        </svg>

        {/* Center pokemon */}
        <div className="absolute" style={{ left: '50%', top: '50%', transform: 'translate(-50%, -50%)', zIndex: 1 }}>
          <EvoCard
            node={circleNode}
            isCurrent={circleNode.name === currentPokemonName}
            {...cardProps}
          />
        </div>

        {/* Surrounding evolutions */}
        {branches.map((branch, i) => {
          const angle = (2 * Math.PI * i / count) - Math.PI / 2; // start from top
          const x = Math.cos(angle) * radius;
          const y = Math.sin(angle) * radius;

          return (
            <div
              key={branch.name}
              className="absolute flex flex-col items-center"
              style={{
                left: `calc(50% + ${x}px)`,
                top: `calc(50% + ${y}px)`,
                transform: 'translate(-50%, -50%)',
                zIndex: 1,
              }}
            >
              {/* Condition badge */}
              <div className="mb-1">
                <ConditionIcon condition={branch.condition} />
              </div>
              <EvoCard node={branch} isCurrent={branch.name === currentPokemonName} {...cardProps} />
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ============================================================
// MAIN COMPONENT
// ============================================================
export default function EvolutionChain({ evolutionTree, currentPokemonName, currentSprite, currentTypes, autoDiscover, token }) {
  const [revealed, setRevealed] = useState({});
  const [evoData, setEvoData] = useState({});
  const [loadingNames, setLoadingNames] = useState(new Set());

  const allNames = evolutionTree ? collectNames(evolutionTree) : [];

  // Reset on tree change
  useEffect(() => {
    setRevealed({});
    setEvoData({});
    setLoadingNames(new Set());

    if (autoDiscover) {
      const all = {};
      allNames.forEach(n => { all[n] = true; });
      setRevealed(all);
      allNames.forEach(n => fetchEvoSprite(n));
    } else if (currentPokemonName) {
      setRevealed({ [currentPokemonName]: true });
    }
  }, [evolutionTree, currentPokemonName, autoDiscover]);

  const fetchEvoSprite = async (name) => {
    if (evoData[name]) return;
    setLoadingNames(prev => new Set([...prev, name]));
    try {
      const res = await fetch(apiUrl(`/api/pokemon/${name}`), {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      if (res.ok) {
        const data = await res.json();
        setEvoData(prev => ({ ...prev, [name]: { sprite: data.sprites, types: data.types } }));
      }
    } catch { /* ignore */ }
    finally {
      setLoadingNames(prev => {
        const next = new Set(prev);
        next.delete(name);
        return next;
      });
    }
  };

  const handleReveal = (name) => {
    setRevealed(prev => ({ ...prev, [name]: true }));
    fetchEvoSprite(name);
  };

  // Fetch sprites for revealed
  useEffect(() => {
    Object.keys(revealed).forEach(name => {
      if (revealed[name]) fetchEvoSprite(name);
    });
  }, [revealed]);

  if (!evolutionTree || allNames.length <= 1) return null;

  const layout = getLayoutType(evolutionTree);
  const commonProps = {
    tree: evolutionTree,
    currentPokemonName, currentSprite, currentTypes,
    revealed, onReveal: handleReveal, evoData, autoDiscover, loadingNames,
  };

  return (
    <div className="w-full mt-16">
      <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-widest mb-3 text-center pb-16">Evolution Chain</h3>
      {layout === 'linear' && <LinearLayout {...commonProps} />}
      {layout === 'fork' && <ForkLayout {...commonProps} />}
      {layout === 'circular' && <CircularLayout {...commonProps} />}
    </div>
  );
}
