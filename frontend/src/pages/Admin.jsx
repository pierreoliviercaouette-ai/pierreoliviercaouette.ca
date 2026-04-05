import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import { 
  Settings, Wrench, Users, Mail, Plus, Trash2, 
  ToggleLeft, ToggleRight, CheckCircle2, XCircle, Clock,
  ChevronDown, Search
} from 'lucide-react';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Button } from '../components/ui/button';
import { Textarea } from '../components/ui/textarea';
import { Badge } from '../components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { toast } from 'sonner';

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

export const Admin = () => {
  const { user, token, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('tools');
  
  // Tools state
  const [tools, setTools] = useState([]);
  const [showToolForm, setShowToolForm] = useState(false);
  const [editingTool, setEditingTool] = useState(null);
  const [toolForm, setToolForm] = useState({
    name: '',
    slug: '',
    description: '',
    html_content: '',
    tags: '',
    is_active: true
  });

  // Referrals state
  const [allReferrals, setAllReferrals] = useState([]);
  const [referralFilter, setReferralFilter] = useState('all');

  // Contacts state
  const [contacts, setContacts] = useState([]);

  // Users state
  const [users, setUsers] = useState([]);
  const [userSearch, setUserSearch] = useState('');

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (authLoading) return; // Wait for auth to finish
    if (!user || !user.is_admin) {
      navigate('/');
      return;
    }
    fetchAllData();
  }, [user, authLoading, navigate]);

  const fetchAllData = async () => {
    try {
      const headers = { Authorization: `Bearer ${token}` };
      const [toolsRes, referralsRes, contactsRes, usersRes] = await Promise.all([
        axios.get(`${API}/tools`, { headers }),
        axios.get(`${API}/admin/referrals`, { headers }),
        axios.get(`${API}/admin/contacts`, { headers }),
        axios.get(`${API}/admin/users`, { headers })
      ]);
      setTools(toolsRes.data);
      setAllReferrals(referralsRes.data);
      setContacts(contactsRes.data);
      setUsers(usersRes.data);
    } catch (error) {
      console.error('Failed to fetch admin data:', error);
      toast.error('Erreur lors du chargement des données');
    } finally {
      setLoading(false);
    }
  };

  // Tools handlers
  const handleToolSubmit = async (e) => {
    e.preventDefault();
    try {
      const headers = { Authorization: `Bearer ${token}` };
      const data = {
        ...toolForm,
        tags: toolForm.tags.split(',').map(t => t.trim()).filter(t => t)
      };

      if (editingTool) {
        await axios.put(`${API}/tools/${editingTool.id}`, data, { headers });
        toast.success('Outil mis à jour!');
      } else {
        await axios.post(`${API}/tools`, data, { headers });
        toast.success('Outil créé!');
      }

      setShowToolForm(false);
      setEditingTool(null);
      setToolForm({ name: '', slug: '', description: '', html_content: '', tags: '', is_active: true });
      fetchAllData();
    } catch (error) {
      toast.error(error.response?.data?.detail || 'Erreur');
    }
  };

  const toggleToolStatus = async (toolId) => {
    try {
      await axios.patch(`${API}/tools/${toolId}/toggle`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchAllData();
    } catch (error) {
      toast.error('Erreur');
    }
  };

  const deleteTool = async (toolId) => {
    if (!confirm('Supprimer cet outil?')) return;
    try {
      await axios.delete(`${API}/tools/${toolId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success('Outil supprimé');
      fetchAllData();
    } catch (error) {
      toast.error('Erreur');
    }
  };

  const editTool = (tool) => {
    setEditingTool(tool);
    setToolForm({
      name: tool.name,
      slug: tool.slug,
      description: tool.description,
      html_content: tool.html_content,
      tags: tool.tags.join(', '),
      is_active: tool.is_active
    });
    setShowToolForm(true);
  };

  // Referral handlers
  const updateReferralStatus = async (referralId, status) => {
    try {
      await axios.patch(`${API}/admin/referrals/${referralId}/status?status=${status}`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success('Statut mis à jour');
      fetchAllData();
    } catch (error) {
      toast.error('Erreur');
    }
  };

  // User handlers
  const toggleUserAdmin = async (userId) => {
    try {
      await axios.patch(`${API}/admin/users/${userId}/admin`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success('Statut admin mis à jour');
      fetchAllData();
    } catch (error) {
      toast.error('Erreur');
    }
  };

  const filteredReferrals = allReferrals.filter(ref => 
    referralFilter === 'all' || ref.status === referralFilter
  );

  const filteredUsers = users.filter(u =>
    u.email.toLowerCase().includes(userSearch.toLowerCase()) ||
    `${u.first_name} ${u.last_name}`.toLowerCase().includes(userSearch.toLowerCase())
  );

  if (authLoading) {
    return (
      <main className="pt-20 min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-prestige-taupe">Chargement...</p>
        </div>
      </main>
    );
  }

  if (!user || !user.is_admin) return null;

  return (
    <main className="pt-20 min-h-screen bg-gray-50" data-testid="admin-page">
      {/* Header */}
      <section className="bg-white border-b border-prestige-beige py-8">
        <div className="container-max px-4 md:px-8">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center">
              <Settings className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="font-heading text-2xl md:text-3xl font-bold text-dark">
                Administration
              </h1>
              <p className="text-prestige-taupe">Gérez votre site et vos données</p>
            </div>
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="section-padding">
        <div className="container-max">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-4 mb-8">
              <TabsTrigger value="tools" className="flex items-center gap-2">
                <Wrench className="w-4 h-4" />
                <span className="hidden sm:inline">Outils</span>
              </TabsTrigger>
              <TabsTrigger value="referrals" className="flex items-center gap-2">
                <Users className="w-4 h-4" />
                <span className="hidden sm:inline">Références</span>
              </TabsTrigger>
              <TabsTrigger value="contacts" className="flex items-center gap-2">
                <Mail className="w-4 h-4" />
                <span className="hidden sm:inline">Contacts</span>
              </TabsTrigger>
              <TabsTrigger value="users" className="flex items-center gap-2">
                <Users className="w-4 h-4" />
                <span className="hidden sm:inline">Utilisateurs</span>
              </TabsTrigger>
            </TabsList>

            {/* Tools Tab */}
            <TabsContent value="tools">
              <div className="bg-white rounded-2xl p-6 shadow-ia">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="font-heading text-xl font-semibold text-dark">
                    Gestion des outils ({tools.length})
                  </h3>
                  <Button 
                    onClick={() => { setShowToolForm(true); setEditingTool(null); }}
                    className="btn-primary"
                    data-testid="add-tool-btn"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Ajouter un outil
                  </Button>
                </div>

                {/* Tool Form */}
                {showToolForm && (
                  <div className="mb-8 p-6 bg-light rounded-xl">
                    <h4 className="font-heading font-semibold text-dark mb-4">
                      {editingTool ? 'Modifier l\'outil' : 'Nouvel outil'}
                    </h4>
                    <form onSubmit={handleToolSubmit} className="space-y-4">
                      <div className="grid md:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="name">Nom *</Label>
                          <Input
                            id="name"
                            value={toolForm.name}
                            onChange={(e) => setToolForm(prev => ({ ...prev, name: e.target.value }))}
                            placeholder="Calculateur d'assurance vie"
                            required
                            data-testid="tool-name-input"
                          />
                        </div>
                        <div>
                          <Label htmlFor="slug">Slug (URL) *</Label>
                          <Input
                            id="slug"
                            value={toolForm.slug}
                            onChange={(e) => setToolForm(prev => ({ ...prev, slug: e.target.value.toLowerCase().replace(/\s+/g, '-') }))}
                            placeholder="calculateur-assurance-vie"
                            required
                            data-testid="tool-slug-input"
                          />
                        </div>
                      </div>
                      <div>
                        <Label htmlFor="description">Description *</Label>
                        <Input
                          id="description"
                          value={toolForm.description}
                          onChange={(e) => setToolForm(prev => ({ ...prev, description: e.target.value }))}
                          placeholder="Estimez vos besoins en assurance vie"
                          required
                          data-testid="tool-description-input"
                        />
                      </div>
                      <div>
                        <Label htmlFor="tags">Tags (séparés par virgules)</Label>
                        <Input
                          id="tags"
                          value={toolForm.tags}
                          onChange={(e) => setToolForm(prev => ({ ...prev, tags: e.target.value }))}
                          placeholder="assurance, calculateur, vie"
                          data-testid="tool-tags-input"
                        />
                      </div>
                      <div>
                        <Label htmlFor="html_content">Contenu HTML *</Label>
                        <Textarea
                          id="html_content"
                          value={toolForm.html_content}
                          onChange={(e) => setToolForm(prev => ({ ...prev, html_content: e.target.value }))}
                          placeholder="<h2>Mon outil</h2><input type='number' placeholder='Montant'/>..."
                          rows={10}
                          className="font-mono text-sm"
                          required
                          data-testid="tool-html-input"
                        />
                      </div>
                      <div className="flex items-center gap-4">
                        <label className="flex items-center gap-2 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={toolForm.is_active}
                            onChange={(e) => setToolForm(prev => ({ ...prev, is_active: e.target.checked }))}
                            className="w-4 h-4"
                          />
                          <span>Outil actif</span>
                        </label>
                      </div>
                      <div className="flex gap-3">
                        <Button 
                          type="button" 
                          variant="outline"
                          onClick={() => { setShowToolForm(false); setEditingTool(null); }}
                        >
                          Annuler
                        </Button>
                        <Button type="submit" className="btn-primary" data-testid="save-tool-btn">
                          {editingTool ? 'Mettre à jour' : 'Créer l\'outil'}
                        </Button>
                      </div>
                    </form>
                  </div>
                )}

                {/* Tools List */}
                {tools.length === 0 ? (
                  <p className="text-prestige-taupe text-center py-8">Aucun outil créé</p>
                ) : (
                  <div className="space-y-3">
                    {tools.map((tool) => (
                      <div 
                        key={tool.id}
                        className="flex items-center justify-between p-4 bg-light rounded-xl"
                        data-testid={`admin-tool-${tool.id}`}
                      >
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <h4 className="font-semibold text-dark">{tool.name}</h4>
                            {!tool.is_active && (
                              <Badge variant="secondary">Inactif</Badge>
                            )}
                          </div>
                          <p className="text-sm text-prestige-taupe">{tool.description}</p>
                          <p className="text-xs text-prestige-taupe mt-1">/{tool.slug}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => toggleToolStatus(tool.id)}
                            data-testid={`toggle-tool-${tool.id}`}
                          >
                            {tool.is_active ? (
                              <ToggleRight className="w-5 h-5 text-green-600" />
                            ) : (
                              <ToggleLeft className="w-5 h-5 text-gray-400" />
                            )}
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => editTool(tool)}
                          >
                            <Settings className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => deleteTool(tool.id)}
                            className="text-red-600 hover:text-red-700"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </TabsContent>

            {/* Referrals Tab */}
            <TabsContent value="referrals">
              <div className="bg-white rounded-2xl p-6 shadow-ia">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="font-heading text-xl font-semibold text-dark">
                    Gestion des références ({allReferrals.length})
                  </h3>
                  <div className="flex items-center gap-2">
                    <select
                      value={referralFilter}
                      onChange={(e) => setReferralFilter(e.target.value)}
                      className="px-3 py-2 border border-prestige-beige rounded-lg"
                    >
                      <option value="all">Tous</option>
                      <option value="pending">En attente</option>
                      <option value="qualified">Qualifiées</option>
                      <option value="rejected">Rejetées</option>
                    </select>
                  </div>
                </div>

                {filteredReferrals.length === 0 ? (
                  <p className="text-prestige-taupe text-center py-8">Aucune référence</p>
                ) : (
                  <div className="space-y-3">
                    {filteredReferrals.map((ref) => (
                      <div 
                        key={ref.id}
                        className="p-4 bg-light rounded-xl"
                        data-testid={`admin-referral-${ref.id}`}
                      >
                        <div className="flex items-start justify-between">
                          <div>
                            <p className="font-semibold text-dark">{ref.referred_name}</p>
                            <p className="text-sm text-prestige-taupe">{ref.referred_email}</p>
                            <p className="text-xs text-prestige-taupe mt-1">
                              Référé par: {ref.referrer_name} ({ref.referrer_email})
                            </p>
                            {ref.notes && (
                              <p className="text-xs text-prestige-taupe mt-1 italic">"{ref.notes}"</p>
                            )}
                          </div>
                          <div className="flex flex-col items-end gap-2">
                            <p className="text-xs text-prestige-taupe">
                              {new Date(ref.created_at).toLocaleDateString('fr-CA')}
                            </p>
                            {ref.status === 'pending' ? (
                              <div className="flex gap-2">
                                <Button
                                  size="sm"
                                  onClick={() => updateReferralStatus(ref.id, 'qualified')}
                                  className="bg-green-600 hover:bg-green-700 text-white"
                                  data-testid={`qualify-referral-${ref.id}`}
                                >
                                  <CheckCircle2 className="w-4 h-4 mr-1" />
                                  Qualifier
                                </Button>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => updateReferralStatus(ref.id, 'rejected')}
                                  className="text-red-600 border-red-600"
                                >
                                  <XCircle className="w-4 h-4 mr-1" />
                                  Rejeter
                                </Button>
                              </div>
                            ) : (
                              <Badge className={
                                ref.status === 'qualified' 
                                  ? 'bg-green-100 text-green-800' 
                                  : 'bg-red-100 text-red-800'
                              }>
                                {ref.status === 'qualified' ? 'Qualifiée' : 'Rejetée'}
                              </Badge>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </TabsContent>

            {/* Contacts Tab */}
            <TabsContent value="contacts">
              <div className="bg-white rounded-2xl p-6 shadow-ia">
                <h3 className="font-heading text-xl font-semibold text-dark mb-6">
                  Demandes de contact ({contacts.length})
                </h3>
                
                {contacts.length === 0 ? (
                  <p className="text-prestige-taupe text-center py-8">Aucune demande</p>
                ) : (
                  <div className="space-y-3">
                    {contacts.map((contact) => (
                      <div 
                        key={contact.id}
                        className="p-4 bg-light rounded-xl"
                        data-testid={`admin-contact-${contact.id}`}
                      >
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <p className="font-semibold text-dark">{contact.name}</p>
                            <p className="text-sm text-prestige-taupe">{contact.email}</p>
                            {contact.phone && (
                              <p className="text-sm text-prestige-taupe">{contact.phone}</p>
                            )}
                          </div>
                          <p className="text-xs text-prestige-taupe">
                            {new Date(contact.created_at).toLocaleDateString('fr-CA')}
                          </p>
                        </div>
                        <p className="font-medium text-dark text-sm">{contact.subject}</p>
                        <p className="text-prestige-taupe text-sm mt-1">{contact.message}</p>
                        {contact.referral_code && (
                          <Badge className="mt-2">Code ref: {contact.referral_code}</Badge>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </TabsContent>

            {/* Users Tab */}
            <TabsContent value="users">
              <div className="bg-white rounded-2xl p-6 shadow-ia">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="font-heading text-xl font-semibold text-dark">
                    Utilisateurs ({users.length})
                  </h3>
                  <div className="relative w-64">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-prestige-taupe" />
                    <Input
                      type="text"
                      placeholder="Rechercher..."
                      value={userSearch}
                      onChange={(e) => setUserSearch(e.target.value)}
                      className="pl-9"
                    />
                  </div>
                </div>
                
                {filteredUsers.length === 0 ? (
                  <p className="text-prestige-taupe text-center py-8">Aucun utilisateur trouvé</p>
                ) : (
                  <div className="space-y-3">
                    {filteredUsers.map((u) => (
                      <div 
                        key={u.id}
                        className="flex items-center justify-between p-4 bg-light rounded-xl"
                        data-testid={`admin-user-${u.id}`}
                      >
                        <div>
                          <div className="flex items-center gap-2">
                            <p className="font-semibold text-dark">
                              {u.first_name} {u.last_name}
                            </p>
                            {u.is_admin && <Badge>Admin</Badge>}
                          </div>
                          <p className="text-sm text-prestige-taupe">{u.email}</p>
                          <p className="text-xs text-prestige-taupe">
                            Code ref: {u.referral_code}
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          <p className="text-xs text-prestige-taupe mr-4">
                            Inscrit le {new Date(u.created_at).toLocaleDateString('fr-CA')}
                          </p>
                          {u.id !== user.id && (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => toggleUserAdmin(u.id)}
                              data-testid={`toggle-admin-${u.id}`}
                            >
                              {u.is_admin ? 'Retirer admin' : 'Rendre admin'}
                            </Button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </section>
    </main>
  );
};
