import { PresentVerbInflector } from 'natural';
// @ts-expect-error: no types
import symbols from 'symbols';
import irregularVerbs from '../data/irregular-verbs.json';

var presentVerbInflector = new PresentVerbInflector();

function ends_with_a_single_vowel_plus_a_consonant_and_not_wx(verb: string) {
	var last = verb.length - 1;

	return symbols.is_consonant(verb[last]) &&
		symbols.is_vowel(verb[last - 1]) &&
		!symbols.is_vowel(verb[last - 2]) &&
		verb[last] !== 'w' &&
		verb[last] !== 'x';
}

function ends_with_c(verb: string) {
	return verb.at(-1)?.toLowerCase() === 'c';
}

function ends_with_consonant_plus_y(verb: string) {
	return verb.at(-1)?.toLowerCase() === 'y' &&
		symbols.is_consonant(verb.at(-1));
}

function ends_with_e(verb: string) {
	return verb.at(-1)?.toLowerCase() === 'e';
}

function ends_with_two_vowels_plus_a_consonant(verb: string) {
	return symbols.is_consonant(verb.at(-1)) &&
		symbols.is_vowel(verb.at(-1)) &&
		symbols.is_vowel(verb.at(-2));
}

function already_in_past(verb: string) {
	return edify(verb, false) === verb;
}

var edify = function(verb: string, checkIsAlreadyInPast = true) {
	switch (true) {
		case checkIsAlreadyInPast && already_in_past(verb):
			return verb;

		case ends_with_c(verb):
			return verb + 'ked';

		case ends_with_consonant_plus_y(verb):
			return verb.slice(0, -1) + 'ied';

		case ends_with_e(verb):
			return verb + 'd';

		case ends_with_two_vowels_plus_a_consonant(verb):
			return verb + 'ed';

		case ends_with_a_single_vowel_plus_a_consonant_and_not_wx(verb):
			return verb + verb.at(-1) + 'ed';

		default:
			return verb + 'ed';
	}
};

export function toPastTense(verb: string) {
	verb = presentVerbInflector.pluralize(verb);

	if (verb in irregularVerbs) {
		return irregularVerbs[verb as keyof typeof irregularVerbs];
	} else {
		return edify(verb);
	}
}
