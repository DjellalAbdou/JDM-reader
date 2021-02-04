import React, { Component } from "react";
import SearchContainer from "./SearchContainer";
import DefAndRaffContainer from "./DefAndRaffContainer";

export default class ResultsContainer extends Component {
    state = {
        word: "test",
        definitions: [
            "Qui est sensible à la pitié, secourable, bienfaisant. \n Avoir, montrer des sentiments humains.    \n Je ne connais pas de coeur plus humain.    \n Cet homme est très humain et fort sensible aux misères d'autrui.",
            "Être vivant qui fait partie de l'espèce humaine. \n J'étais un animal traqué, je ne comprenais plus rien aux humains.    \n (Marie Cardinal, Les mots pour le dire, Livre de Poche, p. 97)",
            "(Au pluriel) L'humanité dans son ensemble.",
            "Relatif à l'espèce humaine. \n Confucius était un moraliste qui se méfiait de l'intelligence ; le terre à terre des relations humaines lui plaisait mieux que la spéculation ondoyante.    \n (Paul Demiéville, La montagne dans l'art littéraire chinois, dans Choix d'études sinologiques (1921-1970), p.364, BRILL, 1973)   \n Le rationalisme cartésien et l'ère nouvelle de la science du XVIIe siècle ont marqué la fin du Moyen Âge et du monopole de l'Église sur les entreprises humaines.    \n (Panayiotis Jerasimof Vatikiotis, L'Islam et l'État, 1987, traduction d'Odette Guitard, 1992, p. 121)   \n Elle se passa les doigts sur les paupières, les yeux reprirent une expression humaine comme si elle revenait d'une pâmoison.    \n (Jean Rogissart, Passantes d'Octobre, Librairie Arthème Fayard, Paris, 1958)   \n La justice, en tant qu'elle veut l'inviolabilité de la personne humaine par le seul fait qu'elle est humaine, ne saurait considérer l'homme que dans l'abstrait.    \n (Julien Benda, La trahison des clercs : Appendice des valeurs cléricales, 1927, éd. 1946)   \n Lorsque l'on ne peut faire autrement que d'affronter le mauvais temps, les forces humaines se décuplent et l'esprit devient plus clairvoyant.    \n (Dieudonné Costes & Maurice Bellonte, Paris-New-York, 1930)   \n Aucune forme humaine ne surgit entre les halliers, aucun bruit humain ne m'arrive. Partout le silence et partout la solitude !    \n (Octave Mirbeau, Le Tripot aux champs, Le Journal, 27 septembre 1896)",
            "Le mot « humanisme » découle des mots homme, humain et humanité qui ont eux-mêmes des origines latines : homo, humanus, humanitas.",
        ],
        raffinements: [
            "test1",
            "test2",
            "test2",
            "test2",
            "test2",
            "test3",
            "test2",
            "test2",
            "test2",
            "test2",
            "test4",
        ],
    };

    render() {
        return (
            <div className="resultscontainer">
                <SearchContainer />
                <DefAndRaffContainer {...this.state} />
            </div>
        );
    }
}
